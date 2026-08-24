package br.com.casatoda

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors

class BlockAccessibilityService : AccessibilityService() {
    private val handler = Handler(Looper.getMainLooper())
    private val networkExecutor = Executors.newSingleThreadExecutor()
    private lateinit var wm: WindowManager
    private var overlay: View? = null
    private var currentPackage: String? = null
    private var overlayTestMode = false
    @Volatile private var remotePolling = false
    private var lastRemotePoll = 0L

    private val ticker = object : Runnable {
        override fun run() {
            evaluate()
            handler.postDelayed(this, 1_000)
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        handler.removeCallbacks(ticker)
        handler.post(ticker)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val pkg = event?.packageName?.toString()
        val cls = event?.className?.toString().orEmpty()
        val isWindowEvent = event?.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED ||
            event?.eventType == AccessibilityEvent.TYPE_WINDOWS_CHANGED
        val isOwnOverlayEvent = !pkg.isNullOrBlank() && pkg == packageName && overlay != null && cls != MainActivity::class.java.name

        if (!pkg.isNullOrBlank() && !isOwnOverlayEvent && (isWindowEvent || currentPackage == null)) {
            currentPackage = pkg
        }
        evaluate()
    }

    override fun onInterrupt() = Unit

    override fun onDestroy() {
        handler.removeCallbacks(ticker)
        networkExecutor.shutdownNow()
        hideOverlay()
        super.onDestroy()
    }

    private fun evaluate() {
        maybePollRemoteState()

        val prefs = getSharedPreferences(MainActivity.PREFS, Context.MODE_PRIVATE)
        val now = System.currentTimeMillis()
        val unlockUntil = prefs.getLong(MainActivity.KEY_UNLOCK_UNTIL, 0L)
        if (unlockUntil > now) {
            hideOverlay()
            return
        } else if (unlockUntil > 0L) {
            prefs.edit().remove(MainActivity.KEY_UNLOCK_UNTIL).apply()
        }

        val enabled = prefs.getBoolean(MainActivity.KEY_ENABLED, false)
        if (!enabled) {
            hideOverlay()
            return
        }

        val dialer = prefs.getString(MainActivity.KEY_DIALER, null)
        val allowed = setOfNotNull(
            packageName,
            dialer,
            "com.android.phone",
            "com.android.server.telecom",
            "com.google.android.dialer",
            "com.samsung.android.dialer",
            "com.android.emergency"
        )

        val testUntil = prefs.getLong(MainActivity.KEY_TEST_BLOCK_UNTIL, 0L)
        val testActive = testUntil > now
        if (!testActive && testUntil > 0L) prefs.edit().remove(MainActivity.KEY_TEST_BLOCK_UNTIL).apply()

        val scheduledBlocked = isBlockedNow(
            prefs.getInt(MainActivity.KEY_CUTOFF_MINUTES, 1320),
            prefs.getInt(MainActivity.KEY_WAKE_MINUTES, 360)
        )

        if (!testActive && !scheduledBlocked) {
            hideOverlay()
            return
        }

        val foreground = foregroundPackage()
        if (foreground in allowed) hideOverlay() else showOverlay(testActive)
    }

    private fun foregroundPackage(): String? {
        val rootPkg = runCatching { rootInActiveWindow?.packageName?.toString() }.getOrNull()
        if (!rootPkg.isNullOrBlank()) {
            if (!(overlay != null && rootPkg == packageName && currentPackage != packageName)) return rootPkg
        }
        return currentPackage
    }

    private fun maybePollRemoteState() {
        val prefs = getSharedPreferences(MainActivity.PREFS, Context.MODE_PRIVATE)
        val code = (prefs.getString(MainActivity.KEY_FAMILY_CODE, "") ?: "").trim().uppercase()
        val childId = (prefs.getString(MainActivity.KEY_CHILD_ID, "") ?: "").trim().lowercase()
        if (code.isBlank() || childId.isBlank()) return

        val now = System.currentTimeMillis()
        if (remotePolling || now - lastRemotePoll < 2_500L) return
        remotePolling = true
        lastRemotePoll = now

        networkExecutor.execute {
            try {
                val stateRows = postRpc("casatoda_get_state", JSONObject().put("p_code", code))
                if (stateRows.length() > 0) {
                    val state = stateRows.optJSONObject(0)?.optJSONObject("state")
                    if (state != null) {
                        updateScheduleFromState(state, childId, prefs)
                        processProtectionTest(state, childId, prefs)
                    }
                }

                val controlRows = postRpc(
                    "casatoda_get_device_control",
                    JSONObject().put("p_code", code).put("p_child_id", childId)
                )
                if (controlRows.length() > 0) {
                    val row = controlRows.optJSONObject(0)
                    if (row != null) {
                        val wake = row.optInt("wake_minutes", 360).coerceIn(0, 1439)
                        prefs.edit().putInt(MainActivity.KEY_WAKE_MINUTES, wake).apply()
                        processDeviceCommand(row.optJSONObject("command"), prefs)
                    }
                }

                handler.post { evaluate() }
            } catch (e: Exception) {
                Log.w("CasaToda", "Falha ao atualizar controle remoto", e)
            } finally {
                remotePolling = false
            }
        }
    }

    private fun postRpc(name: String, body: JSONObject): JSONArray {
        val connection = (URL("$SB_URL/rest/v1/rpc/$name").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 5_000
            readTimeout = 5_000
            doOutput = true
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("apikey", SB_KEY)
            setRequestProperty("Authorization", "Bearer $SB_KEY")
        }
        connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
        val responseCode = connection.responseCode
        if (responseCode !in 200..299) {
            connection.disconnect()
            throw IllegalStateException("RPC $name retornou $responseCode")
        }
        val text = connection.inputStream.bufferedReader().use { it.readText() }
        connection.disconnect()
        return JSONArray(text)
    }

    private fun updateScheduleFromState(state: JSONObject, childId: String, prefs: android.content.SharedPreferences) {
        val settings = state.optJSONObject("settings")
        val base = settings?.optJSONObject("cutoffMinutes")?.optInt(childId, 1320)?.coerceIn(0, 1439) ?: 1320
        val dateKey = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val childDay = state.optJSONObject("days")
            ?.optJSONObject(dateKey)
            ?.optJSONObject("children")
            ?.optJSONObject(childId)
        val lost = childDay?.optInt("lost", 0)?.coerceAtLeast(0) ?: 0
        val gained = childDay?.optInt("gained", 0)?.coerceAtLeast(0) ?: 0
        val finalCutoff = (base - lost + gained).coerceIn(0, 1439)

        prefs.edit()
            .putBoolean(MainActivity.KEY_ENABLED, true)
            .putInt(MainActivity.KEY_BASE_MINUTES, base)
            .putInt(MainActivity.KEY_CUTOFF_MINUTES, finalCutoff)
            .apply()
    }

    private fun processProtectionTest(state: JSONObject, childId: String, prefs: android.content.SharedPreferences) {
        val command = state.optJSONObject("protectionTest") ?: return
        val target = command.optString("target", "").trim().lowercase()
        val nonce = command.optString("nonce", "").trim()
        if (target != childId || nonce.isBlank()) return

        val lastNonce = prefs.getString(KEY_LAST_REMOTE_TEST_NONCE, "") ?: ""
        if (lastNonce == nonce) return

        val requestedAt = command.optLong("requestedAt", 0L)
        val age = System.currentTimeMillis() - requestedAt
        if (requestedAt <= 0L || age < -60_000L || age > 5L * 60L * 1000L) return

        val seconds = command.optInt("seconds", 30).coerceIn(10, 120)
        prefs.edit()
            .putString(KEY_LAST_REMOTE_TEST_NONCE, nonce)
            .putLong(MainActivity.KEY_TEST_BLOCK_UNTIL, System.currentTimeMillis() + seconds * 1000L)
            .apply()
        Log.i("CasaToda", "Teste remoto recebido para $childId")
    }

    private fun processDeviceCommand(command: JSONObject?, prefs: android.content.SharedPreferences) {
        if (command == null) return
        val nonce = command.optString("nonce", "").trim()
        if (nonce.isBlank()) return
        val last = prefs.getString(KEY_LAST_DEVICE_COMMAND_NONCE, "") ?: ""
        if (last == nonce) return

        when (command.optString("action", "")) {
            "unlock" -> {
                val until = command.optLong("untilMs", 0L)
                if (until > System.currentTimeMillis()) {
                    prefs.edit().putLong(MainActivity.KEY_UNLOCK_UNTIL, until).apply()
                    Log.i("CasaToda", "Desbloqueio remoto aplicado")
                }
            }
            "resume" -> {
                prefs.edit().remove(MainActivity.KEY_UNLOCK_UNTIL).apply()
                Log.i("CasaToda", "Regra normal reaplicada")
            }
        }
        prefs.edit().putString(KEY_LAST_DEVICE_COMMAND_NONCE, nonce).apply()
    }

    private fun isBlockedNow(cutoff: Int, wake: Int): Boolean {
        val now = Calendar.getInstance()
        val minute = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
        return if (cutoff > wake) minute >= cutoff || minute < wake else minute >= cutoff && minute < wake
    }

    private fun showOverlay(testMode: Boolean) {
        if (overlay != null && overlayTestMode == testMode) return
        hideOverlay()
        overlayTestMode = testMode

        val prefs = getSharedPreferences(MainActivity.PREFS, Context.MODE_PRIVATE)
        val wake = prefs.getInt(MainActivity.KEY_WAKE_MINUTES, 360)
        val wakeText = String.format(Locale.getDefault(), "%02d:%02d", wake / 60, wake % 60)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(40, 56, 40, 56)
            setBackgroundColor(Color.rgb(25, 20, 61))
            systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        }

        val moon = TextView(this).apply {
            text = if (testMode) "✓" else "☾"
            textSize = 58f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(214, 190, 255))
        }
        val title = TextView(this).apply {
            text = if (testMode) "Teste do CasaToda Proteção" else "Tempo encerrado por hoje"
            textSize = 28f
            gravity = Gravity.CENTER
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            setPadding(0, 18, 0, 12)
        }
        val message = TextView(this).apply {
            text = if (testMode)
                "Este é apenas um teste. O aparelho será liberado automaticamente em até 30 segundos."
            else
                "O horário definido no CasaToda chegou. Os aplicativos ficam bloqueados até $wakeText."
            textSize = 16f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(220, 216, 235))
            setPadding(18, 0, 18, 28)
        }
        val parentButton = Button(this).apply {
            text = "Desbloqueio dos pais"
            setOnClickListener {
                hideOverlay()
                val i = Intent(this@BlockAccessibilityService, MainActivity::class.java).apply {
                    putExtra(MainActivity.EXTRA_PARENT_UNLOCK, true)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                }
                startActivity(i)
            }
        }
        val emergencyButton = Button(this).apply {
            text = "Ligação de emergência"
            setOnClickListener {
                hideOverlay()
                val i = Intent(Intent.ACTION_DIAL, Uri.parse("tel:")).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
                runCatching { startActivity(i) }
            }
        }
        val note = TextView(this).apply {
            text = if (testMode)
                "Nenhuma alteração permanente foi feita no horário."
            else
                "Se necessário, seus responsáveis podem liberar o aparelho remotamente pelo CasaToda."
            textSize = 12f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(170, 164, 195))
            setPadding(0, 24, 0, 0)
        }

        root.addView(moon)
        root.addView(title)
        root.addView(message)
        root.addView(parentButton, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT).apply { bottomMargin = 12 })
        root.addView(emergencyButton, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))
        root.addView(note)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.START }

        runCatching {
            wm.addView(root, params)
            overlay = root
        }
    }

    private fun hideOverlay() {
        val v = overlay ?: return
        runCatching { wm.removeView(v) }
        overlay = null
        overlayTestMode = false
    }

    companion object {
        private const val SB_URL = "https://fkxwlezflfpdrronluci.supabase.co"
        private const val SB_KEY = "sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl"
        private const val KEY_LAST_REMOTE_TEST_NONCE = "last_remote_test_nonce"
        private const val KEY_LAST_DEVICE_COMMAND_NONCE = "last_device_command_nonce"
    }
}
