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
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import java.util.Calendar

class BlockAccessibilityService : AccessibilityService() {
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var wm: WindowManager
    private var overlay: View? = null
    private var currentPackage: String? = null

    private val ticker = object : Runnable {
        override fun run() {
            evaluate()
            handler.postDelayed(this, 2_000)
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
        if (!pkg.isNullOrBlank()) currentPackage = pkg
        evaluate()
    }

    override fun onInterrupt() = Unit

    override fun onDestroy() {
        handler.removeCallbacks(ticker)
        hideOverlay()
        super.onDestroy()
    }

    private fun evaluate() {
        val prefs = getSharedPreferences(MainActivity.PREFS, Context.MODE_PRIVATE)
        val enabled = prefs.getBoolean(MainActivity.KEY_ENABLED, false)
        val pauseUntil = prefs.getLong(MainActivity.KEY_PAUSE_UNTIL, 0L)
        if (!enabled || System.currentTimeMillis() < pauseUntil) {
            hideOverlay()
            return
        }

        val cutoff = prefs.getInt(MainActivity.KEY_CUTOFF_MINUTES, 1320)
        val wake = prefs.getInt(MainActivity.KEY_WAKE_MINUTES, 360)
        if (!isBlockedNow(cutoff, wake)) {
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

        if (currentPackage in allowed) hideOverlay() else showOverlay()
    }

    private fun isBlockedNow(cutoff: Int, wake: Int): Boolean {
        val now = Calendar.getInstance()
        val minute = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
        return if (cutoff > wake) minute >= cutoff || minute < wake else minute >= cutoff && minute < wake
    }

    private fun showOverlay() {
        if (overlay != null) return

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(40, 56, 40, 56)
            setBackgroundColor(Color.rgb(25, 20, 61))
            systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        }

        val moon = TextView(this).apply {
            text = "☾"
            textSize = 58f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(214, 190, 255))
        }
        val title = TextView(this).apply {
            text = "Tempo encerrado por hoje"
            textSize = 28f
            gravity = Gravity.CENTER
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            setPadding(0, 18, 0, 12)
        }
        val message = TextView(this).apply {
            text = "O horário definido no CasaToda chegou. Os aplicativos ficam bloqueados até amanhã de manhã."
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
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP)
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
            text = "Pais podem liberar o aparelho por 15 minutos usando o código da família."
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
        ).apply {
            gravity = Gravity.TOP or Gravity.START
        }

        runCatching {
            wm.addView(root, params)
            overlay = root
        }
    }

    private fun hideOverlay() {
        val v = overlay ?: return
        runCatching { wm.removeView(v) }
        overlay = null
    }
}
