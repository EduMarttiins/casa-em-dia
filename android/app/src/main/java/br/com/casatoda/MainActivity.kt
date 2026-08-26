package br.com.casatoda

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.text.InputType
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.EditText
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private var permissionDialogVisible = false
    private var locationDialogVisible = false
    private var usageDialogVisible = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(91, 53, 201)
        window.navigationBarColor = Color.WHITE
        rememberDialerPackage()

        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            userAgentString = "$userAgentString CasaSeguraAndroid/0.12"
        }

        webView.addJavascriptInterface(CasaTodaBridge(this), "CasaTodaAndroid")
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val uri = request?.url ?: return false
                return if (uri.scheme == "http" || uri.scheme == "https") false
                else {
                    runCatching { startActivity(Intent(Intent.ACTION_VIEW, uri)) }
                    true
                }
            }
        }

        if (savedInstanceState == null) webView.loadUrl("https://edumarttiins.github.io/casa-em-dia/?source=apk")
        else webView.restoreState(savedInstanceState)

        maybeShowParentUnlock(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        maybeShowParentUnlock(intent)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onResume() {
        super.onResume()
        if (!isProtectionEnabled() && !permissionDialogVisible) {
            permissionDialogVisible = true
            AlertDialog.Builder(this)
                .setTitle("Ativar CasaSegura Proteção")
                .setMessage("Para bloquear os aplicativos no horário definido, ative CasaSegura Proteção em Acessibilidade.\n\nSe estiver bloqueado, abra Informações do app e escolha Permitir configurações restritas.")
                .setNegativeButton("Depois") { _, _ -> permissionDialogVisible = false }
                .setNeutralButton("Informações do app") { _, _ -> permissionDialogVisible = false; openAppInfo() }
                .setPositiveButton("Abrir Acessibilidade") { _, _ -> permissionDialogVisible = false; startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)) }
                .setOnCancelListener { permissionDialogVisible = false }
                .show()
            return
        }
        if (isProtectionEnabled() && !locationDialogVisible) maybeOfferLocationSetup()
        if (isProtectionEnabled() && !locationDialogVisible && !usageDialogVisible) maybeOfferUsageSetup()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQUEST_LOCATION) return
        val prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        prefs.edit().putBoolean(KEY_LOCATION_SETUP_PROMPTED, true).apply()
        webView.postDelayed({
            locationDialogVisible = false
            if (isProtectionEnabled()) maybeOfferLocationSetup(force = true)
        }, 350)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    private fun isProtectionEnabled(): Boolean {
        val component = ComponentName(this, BlockAccessibilityService::class.java).flattenToString()
        val enabled = Settings.Secure.getString(contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: return false
        return enabled.split(':').any { it.equals(component, ignoreCase = true) }
    }

    private fun hasForegroundLocation(): Boolean {
        return checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
            checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    private fun hasBackgroundLocation(): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q ||
            checkSelfPermission(Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    private fun locationPermissionStatus(): String {
        if (!hasForegroundLocation()) return "permission_denied"
        if (!hasBackgroundLocation()) return "background_permission_required"
        return "granted"
    }

    private fun maybeOfferLocationSetup(force: Boolean = false) {
        val prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val required = prefs.getBoolean(KEY_LOCATION_PERMISSION_REQUIRED, false)
        val prompted = prefs.getBoolean(KEY_LOCATION_SETUP_PROMPTED, false)

        if (hasForegroundLocation() && hasBackgroundLocation()) {
            prefs.edit()
                .putBoolean(KEY_LOCATION_PERMISSION_REQUIRED, false)
                .putBoolean(KEY_LOCATION_SETUP_PROMPTED, true)
                .apply()
            return
        }
        if (!force && !required && prompted) return
        if (locationDialogVisible) return

        locationDialogVisible = true
        if (!hasForegroundLocation()) {
            AlertDialog.Builder(this)
                .setTitle("Ativar Encontrar aparelho")
                .setMessage("O CasaSegura pode localizar este celular quando você usar Localizar agora na Central dos aparelhos. A localização é consultada somente quando solicitada.")
                .setNegativeButton("Agora não") { _, _ ->
                    locationDialogVisible = false
                    prefs.edit()
                        .putBoolean(KEY_LOCATION_SETUP_PROMPTED, true)
                        .putBoolean(KEY_LOCATION_PERMISSION_REQUIRED, false)
                        .apply()
                }
                .setPositiveButton("Permitir localização") { _, _ ->
                    locationDialogVisible = false
                    prefs.edit().putBoolean(KEY_LOCATION_SETUP_PROMPTED, true).apply()
                    requestPermissions(
                        arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
                        REQUEST_LOCATION
                    )
                }
                .setOnCancelListener { locationDialogVisible = false }
                .show()
            return
        }

        if (!hasBackgroundLocation()) {
            AlertDialog.Builder(this)
                .setTitle("Permitir localização o tempo todo")
                .setMessage("Para encontrar este aparelho mesmo quando o CasaSegura não estiver aberto na tela, permita Localização o tempo todo nas permissões do aplicativo.")
                .setNegativeButton("Depois") { _, _ ->
                    locationDialogVisible = false
                    prefs.edit()
                        .putBoolean(KEY_LOCATION_SETUP_PROMPTED, true)
                        .putBoolean(KEY_LOCATION_PERMISSION_REQUIRED, false)
                        .apply()
                }
                .setPositiveButton("Abrir permissões") { _, _ ->
                    locationDialogVisible = false
                    prefs.edit()
                        .putBoolean(KEY_LOCATION_SETUP_PROMPTED, true)
                        .putBoolean(KEY_LOCATION_PERMISSION_REQUIRED, false)
                        .apply()
                    openAppInfo()
                }
                .setOnCancelListener { locationDialogVisible = false }
                .show()
        }
    }

    private fun maybeOfferUsageSetup(force: Boolean = false) {
        val prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        if (UsageStatsSupport.hasUsageAccess(this)) {
            prefs.edit().putBoolean(KEY_USAGE_SETUP_PROMPTED, true).apply()
            return
        }
        val prompted = prefs.getBoolean(KEY_USAGE_SETUP_PROMPTED, false)
        if (!force && prompted) return
        if (usageDialogVisible) return

        usageDialogVisible = true
        AlertDialog.Builder(this)
            .setTitle("Ativar Tempo de tela")
            .setMessage("Para mostrar aos pais quanto tempo foi usado em YouTube, TikTok, WhatsApp e outros aplicativos, permita Acesso ao uso para o CasaSegura. O CasaSegura registra apenas o tempo de uso, não o conteúdo visto ou as mensagens.")
            .setNegativeButton("Depois") { _, _ ->
                usageDialogVisible = false
                prefs.edit().putBoolean(KEY_USAGE_SETUP_PROMPTED, true).apply()
            }
            .setPositiveButton("Abrir Acesso ao uso") { _, _ ->
                usageDialogVisible = false
                prefs.edit().putBoolean(KEY_USAGE_SETUP_PROMPTED, true).apply()
                openUsageAccessSettings()
            }
            .setOnCancelListener { usageDialogVisible = false }
            .show()
    }

    private fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            data = Uri.parse("package:$packageName")
        }
        runCatching { startActivity(intent) }
            .onFailure { startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)) }
    }

    private fun openAppInfo() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply { data = Uri.parse("package:$packageName") }
        startActivity(intent)
    }

    private fun rememberDialerPackage() {
        val dial = Intent(Intent.ACTION_DIAL, Uri.parse("tel:"))
        val resolved = dial.resolveActivity(packageManager)?.packageName ?: return
        getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_DIALER, resolved).apply()
    }

    private fun maybeShowParentUnlock(sourceIntent: Intent?) {
        if (sourceIntent?.getBooleanExtra(EXTRA_PARENT_UNLOCK, false) != true) return
        sourceIntent.removeExtra(EXTRA_PARENT_UNLOCK)

        val prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val expected = (prefs.getString(KEY_FAMILY_CODE, "") ?: "").trim().uppercase()

        if (expected.isBlank()) {
            AlertDialog.Builder(this)
                .setTitle("Desbloqueio dos pais")
                .setMessage("Este aparelho ainda não armazenou o código da família. Para recuperar o acesso agora, desative temporariamente CasaSegura Proteção em Acessibilidade. Depois abra o CasaSegura para sincronizar novamente.")
                .setNegativeButton("Cancelar", null)
                .setPositiveButton("Abrir Acessibilidade") { _, _ -> startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)) }
                .show()
            return
        }

        val input = EditText(this).apply {
            hint = "Código da família"
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            setSingleLine(true)
        }

        AlertDialog.Builder(this)
            .setTitle("Desbloqueio dos pais")
            .setMessage("Digite o código da família para liberar este aparelho por 15 minutos.")
            .setView(input)
            .setNegativeButton("Cancelar", null)
            .setPositiveButton("Desbloquear") { _, _ ->
                val typed = input.text.toString().trim().uppercase()
                if (typed == expected) {
                    prefs.edit().putLong(KEY_UNLOCK_UNTIL, System.currentTimeMillis() + 15L * 60L * 1000L).apply()
                    sendBroadcast(Intent(ACTION_REFRESH))
                    Toast.makeText(this, "Aparelho liberado por 15 minutos", Toast.LENGTH_LONG).show()
                    goHome()
                } else {
                    Toast.makeText(this, "Código da família incorreto", Toast.LENGTH_LONG).show()
                }
            }
            .show()
    }

    private fun goHome() {
        val home = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        startActivity(home)
    }

    class CasaTodaBridge(private val activity: MainActivity) {
        private val prefs = activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

        @JavascriptInterface
        fun setChildSchedule(childId: String, baseMinutes: Int, lostMinutes: Int, gainedMinutes: Int) {
            val normalized = childId.trim().lowercase()
            if (normalized !in setOf("bernardo", "julia")) return
            val base = baseMinutes.coerceIn(0, 1439)
            val cutoff = (base - lostMinutes.coerceAtLeast(0) + gainedMinutes.coerceAtLeast(0)).coerceIn(0, 1439)
            prefs.edit()
                .putBoolean(KEY_ENABLED, true)
                .putString(KEY_CHILD_ID, normalized)
                .putInt(KEY_BASE_MINUTES, base)
                .putInt(KEY_CUTOFF_MINUTES, cutoff)
                .apply()
            activity.sendBroadcast(Intent(ACTION_REFRESH))
        }

        @JavascriptInterface
        fun setDeviceProfile(deviceId: String) {
            val normalized = deviceId.trim().lowercase()
            if (normalized !in setOf("bernardo", "julia", "irmaos")) return
            val editor = prefs.edit()
                .putBoolean(KEY_ENABLED, true)
                .putString(KEY_CHILD_ID, normalized)
            if (!prefs.contains(KEY_CUTOFF_MINUTES)) editor.putInt(KEY_CUTOFF_MINUTES, 1320)
            if (!prefs.contains(KEY_BASE_MINUTES)) editor.putInt(KEY_BASE_MINUTES, 1320)
            if (!prefs.contains(KEY_WAKE_MINUTES)) editor.putInt(KEY_WAKE_MINUTES, 360)
            editor.apply()
            activity.sendBroadcast(Intent(ACTION_REFRESH))
        }

        @JavascriptInterface
        fun getDeviceProfile(): String = prefs.getString(KEY_CHILD_ID, "") ?: ""

        @JavascriptInterface
        fun setFamilyCode(code: String) {
            val normalized = code.trim().uppercase()
            if (normalized.isNotBlank()) prefs.edit().putString(KEY_FAMILY_CODE, normalized).apply()
        }

        @JavascriptInterface
        fun getFamilyCode(): String = prefs.getString(KEY_FAMILY_CODE, "") ?: ""

        @JavascriptInterface
        fun getChildId(): String = prefs.getString(KEY_CHILD_ID, "") ?: ""

        @JavascriptInterface
        fun getNativeVersion(): String = "0.12.0"

        @JavascriptInterface
        fun getProtectionEnabled(): Boolean = activity.isProtectionEnabled()

        @JavascriptInterface
        fun getLocationPermissionStatus(): String = activity.locationPermissionStatus()

        @JavascriptInterface
        fun requestLocationSetup() {
            activity.runOnUiThread { activity.maybeOfferLocationSetup(force = true) }
        }

        @JavascriptInterface
        fun getUsageAccessEnabled(): Boolean = UsageStatsSupport.hasUsageAccess(activity)

        @JavascriptInterface
        fun openUsageAccessSettings() {
            activity.runOnUiThread { activity.openUsageAccessSettings() }
        }

        @JavascriptInterface
        fun getParentUnlockRequested(): Boolean = prefs.getBoolean(KEY_PARENT_UNLOCK_REQUESTED, false)

        @JavascriptInterface
        fun grantParentUnlock(minutes: Int) {
            val safeMinutes = minutes.coerceIn(5, 120)
            val until = System.currentTimeMillis() + safeMinutes * 60_000L
            prefs.edit().putLong(KEY_UNLOCK_UNTIL, until).putBoolean(KEY_PARENT_UNLOCK_REQUESTED, false).apply()
            activity.sendBroadcast(Intent(ACTION_REFRESH))
        }

        @JavascriptInterface
        fun clearParentUnlockRequest() {
            prefs.edit().putBoolean(KEY_PARENT_UNLOCK_REQUESTED, false).apply()
        }

        @JavascriptInterface
        fun startProtectionTest(seconds: Int) {
            val safeSeconds = seconds.coerceIn(10, 120)
            prefs.edit().putLong(KEY_TEST_BLOCK_UNTIL, System.currentTimeMillis() + safeSeconds * 1000L).apply()
            activity.sendBroadcast(Intent(ACTION_REFRESH))
        }

        @JavascriptInterface
        fun openProtectionSettings() {
            activity.runOnUiThread { activity.startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)) }
        }

        @JavascriptInterface
        fun openAppInfo() {
            activity.runOnUiThread { activity.openAppInfo() }
        }
    }

    companion object {
        const val PREFS = "casatoda_native"
        const val KEY_ENABLED = "block_enabled"
        const val KEY_CHILD_ID = "child_id"
        const val KEY_BASE_MINUTES = "base_minutes"
        const val KEY_CUTOFF_MINUTES = "cutoff_minutes"
        const val KEY_WAKE_MINUTES = "wake_minutes"
        const val KEY_DIALER = "dialer_package"
        const val KEY_PARENT_UNLOCK_REQUESTED = "parent_unlock_requested"
        const val KEY_UNLOCK_UNTIL = "unlock_until"
        const val KEY_TEST_BLOCK_UNTIL = "test_block_until"
        const val KEY_FAMILY_CODE = "family_code"
        const val KEY_LOCATION_SETUP_PROMPTED = "location_setup_prompted"
        const val KEY_LOCATION_PERMISSION_REQUIRED = "location_permission_required"
        const val KEY_USAGE_SETUP_PROMPTED = "usage_setup_prompted"
        const val ACTION_REFRESH = "br.com.casatoda.REFRESH_BLOCKER"
        const val EXTRA_PARENT_UNLOCK = "parent_unlock"
        private const val REQUEST_LOCATION = 511
    }
}
