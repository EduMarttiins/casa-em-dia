package br.com.casatoda

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Process
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors

object UsageStatsSupport {
    private const val SB_URL = "https://fkxwlezflfpdrronluci.supabase.co"
    private const val SB_KEY = "sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl"
    private const val TAG = "CasaSeguraUsage"
    private const val KEY_LAST_REPORT = "usage_last_report_ms"
    private const val REPORT_INTERVAL = 5L * 60L * 1000L
    private val executor = Executors.newSingleThreadExecutor()

    fun hasUsageAccess(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun maybeReport(context: Context, familyCode: String, childId: String, force: Boolean = false) {
        if (childId == "irmaos") return
        val prefs = context.getSharedPreferences(MainActivity.PREFS, Context.MODE_PRIVATE)
        val now = System.currentTimeMillis()
        val last = prefs.getLong(KEY_LAST_REPORT, 0L)
        if (!force && now - last < REPORT_INTERVAL) return
        prefs.edit().putLong(KEY_LAST_REPORT, now).apply()

        executor.execute {
            try {
                if (!hasUsageAccess(context)) {
                    report(familyCode, childId, JSONObject(), "permission_required")
                    return@execute
                }
                val summary = buildSummary(context)
                report(familyCode, childId, summary, "ok")
            } catch (e: Exception) {
                Log.w(TAG, "Falha ao preparar tempo de tela", e)
                runCatching { report(familyCode, childId, JSONObject(), "error") }
            }
        }
    }

    private fun buildSummary(context: Context): JSONObject {
        val now = System.currentTimeMillis()
        val todayStart = startOfDay(now)
        val today = appUsageForRange(context, todayStart, now)
        val appsArray = JSONArray()
        today.second.take(15).forEach { app ->
            appsArray.put(
                JSONObject()
                    .put("package", app.packageName)
                    .put("name", app.label)
                    .put("ms", app.ms)
            )
        }

        val days = JSONArray()
        for (offset in 6 downTo 0) {
            val start = dayStartOffset(now, -offset)
            val end = if (offset == 0) now else dayStartOffset(now, -offset + 1)
            val total = appUsageForRange(context, start, end).first
            days.put(
                JSONObject()
                    .put("date", SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(start)))
                    .put("totalMs", total)
            )
        }

        return JSONObject()
            .put("date", SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(now)))
            .put("totalMs", today.first)
            .put("apps", appsArray)
            .put("days", days)
            .put("generatedAt", now)
    }

    private data class AppUsage(val packageName: String, val label: String, val ms: Long)

    private fun appUsageForRange(context: Context, start: Long, end: Long): Pair<Long, List<AppUsage>> {
        val manager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val stats = manager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end).orEmpty()
        val merged = linkedMapOf<String, Long>()
        for (item in stats) {
            val pkg = item.packageName ?: continue
            val ms = item.totalTimeInForeground.coerceAtLeast(0L)
            if (ms < 30_000L) continue
            if (shouldIgnore(context, pkg)) continue
            merged[pkg] = (merged[pkg] ?: 0L) + ms
        }

        val pm = context.packageManager
        val apps = merged.map { (pkg, ms) ->
            val label = runCatching {
                val info = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    pm.getApplicationInfo(pkg, PackageManager.ApplicationInfoFlags.of(0L))
                } else {
                    @Suppress("DEPRECATION") pm.getApplicationInfo(pkg, 0)
                }
                pm.getApplicationLabel(info).toString().ifBlank { pkg }
            }.getOrDefault(pkg)
            AppUsage(pkg, label, ms)
        }.sortedByDescending { it.ms }

        return apps.sumOf { it.ms } to apps
    }

    private fun shouldIgnore(context: Context, pkg: String): Boolean {
        if (pkg == context.packageName) return true
        if (pkg == "android" || pkg == "com.android.systemui") return true
        if (pkg.contains("launcher", ignoreCase = true)) return true
        if (pkg.contains("permissioncontroller", ignoreCase = true)) return true
        if (pkg.contains("packageinstaller", ignoreCase = true)) return true
        return false
    }

    private fun startOfDay(time: Long): Long {
        return Calendar.getInstance().apply {
            timeInMillis = time
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }

    private fun dayStartOffset(time: Long, offsetDays: Int): Long {
        return Calendar.getInstance().apply {
            timeInMillis = time
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            add(Calendar.DAY_OF_YEAR, offsetDays)
        }.timeInMillis
    }

    private fun report(familyCode: String, childId: String, summary: JSONObject, status: String) {
        val body = JSONObject()
            .put("p_code", familyCode)
            .put("p_child_id", childId)
            .put("p_usage", summary)
            .put("p_status", status)

        val connection = (URL("$SB_URL/rest/v1/rpc/casasegura_report_app_usage").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 7_000
            readTimeout = 7_000
            doOutput = true
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("apikey", SB_KEY)
            setRequestProperty("Authorization", "Bearer $SB_KEY")
        }
        connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
        val code = connection.responseCode
        if (code !in 200..299) {
            connection.disconnect()
            throw IllegalStateException("Tempo de tela HTTP $code")
        }
        connection.inputStream.close()
        connection.disconnect()
    }
}
