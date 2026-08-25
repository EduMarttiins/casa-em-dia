package br.com.casatoda

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.CancellationSignal
import android.os.Handler
import android.os.Looper
import android.util.Log
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

object FindDeviceSupport {
    private const val SB_URL = "https://fkxwlezflfpdrronluci.supabase.co"
    private const val SB_KEY = "sb_publishable_5KlTca79dddAuF976jnd1w_mugqoPbl"
    private const val TAG = "CasaTodaFind"

    private val handler = Handler(Looper.getMainLooper())
    private val executor = Executors.newSingleThreadExecutor()

    private var player: MediaPlayer? = null
    private var previousAlarmVolume: Int? = null
    private var stopSoundRunnable: Runnable? = null

    private var locationListener: LocationListener? = null
    private var cancellationSignal: CancellationSignal? = null
    private var locationTimeoutRunnable: Runnable? = null

    fun handleCommand(
        context: Context,
        command: JSONObject,
        familyCode: String,
        childId: String,
        prefs: android.content.SharedPreferences
    ) {
        val requestedAt = command.optLong("requestedAt", 0L)
        val age = System.currentTimeMillis() - requestedAt
        if (requestedAt <= 0L || age < -60_000L || age > 5L * 60L * 1000L) return

        when (command.optString("action", "")) {
            "locate" -> requestLocation(context, familyCode, childId, prefs)
            "ring" -> startSound(context, command.optInt("seconds", 60).coerceIn(15, 180))
            "stop_ring" -> stopSound(context)
        }
    }

    fun stop(context: Context) {
        handler.post {
            stopSoundNow(context)
            cancelPendingLocation(context)
        }
    }

    private fun hasForegroundLocation(context: Context): Boolean {
        return context.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
            context.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    private fun hasBackgroundLocation(context: Context): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q ||
            context.checkSelfPermission(Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestLocation(
        context: Context,
        familyCode: String,
        childId: String,
        prefs: android.content.SharedPreferences
    ) {
        if (!hasForegroundLocation(context)) {
            prefs.edit().putBoolean(MainActivity.KEY_LOCATION_PERMISSION_REQUIRED, true).apply()
            reportLocation(familyCode, childId, null, "permission_denied")
            return
        }
        if (!hasBackgroundLocation(context)) {
            prefs.edit().putBoolean(MainActivity.KEY_LOCATION_PERMISSION_REQUIRED, true).apply()
            reportLocation(familyCode, childId, null, "background_permission_required")
            return
        }

        prefs.edit().putBoolean(MainActivity.KEY_LOCATION_PERMISSION_REQUIRED, false).apply()
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val providers = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
            .filter { runCatching { lm.isProviderEnabled(it) }.getOrDefault(false) }

        if (providers.isEmpty()) {
            reportLocation(familyCode, childId, null, "location_disabled")
            return
        }

        handler.post {
            cancelPendingLocation(context)

            val fallback = providers.mapNotNull { provider ->
                runCatching { lm.getLastKnownLocation(provider) }.getOrNull()
            }.maxByOrNull { it.time }

            val finished = AtomicBoolean(false)

            fun finish(location: Location?, status: String) {
                if (!finished.compareAndSet(false, true)) return
                cancelPendingLocation(context)
                reportLocation(familyCode, childId, location, status)
            }

            fun attemptProvider(index: Int) {
                if (index >= providers.size) {
                    if (fallback != null) finish(fallback, "last_known") else finish(null, "timeout")
                    return
                }
                val provider = providers[index]
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                        val signal = CancellationSignal()
                        cancellationSignal = signal
                        lm.getCurrentLocation(provider, signal, context.mainExecutor) { location ->
                            if (location != null) finish(location, "ok") else attemptProvider(index + 1)
                        }
                    } else {
                        val listener = object : LocationListener {
                            override fun onLocationChanged(location: Location) {
                                finish(location, "ok")
                            }
                            @Deprecated("Deprecated in Android")
                            override fun onStatusChanged(provider: String?, status: Int, extras: android.os.Bundle?) = Unit
                            override fun onProviderEnabled(provider: String) = Unit
                            override fun onProviderDisabled(provider: String) {
                                attemptProvider(index + 1)
                            }
                        }
                        locationListener = listener
                        @Suppress("DEPRECATION")
                        lm.requestSingleUpdate(provider, listener, Looper.getMainLooper())
                    }
                } catch (e: SecurityException) {
                    prefs.edit().putBoolean(MainActivity.KEY_LOCATION_PERMISSION_REQUIRED, true).apply()
                    finish(null, "permission_denied")
                } catch (e: Exception) {
                    Log.w(TAG, "Falha no provedor $provider", e)
                    attemptProvider(index + 1)
                }
            }

            val timeout = Runnable {
                if (fallback != null) finish(fallback, "last_known") else finish(null, "timeout")
            }
            locationTimeoutRunnable = timeout
            handler.postDelayed(timeout, 15_000L)
            attemptProvider(0)
        }
    }

    private fun cancelPendingLocation(context: Context) {
        locationTimeoutRunnable?.let { handler.removeCallbacks(it) }
        locationTimeoutRunnable = null
        cancellationSignal?.cancel()
        cancellationSignal = null
        val listener = locationListener
        if (listener != null) {
            val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            runCatching { lm.removeUpdates(listener) }
        }
        locationListener = null
    }

    private fun reportLocation(familyCode: String, childId: String, location: Location?, status: String) {
        executor.execute {
            try {
                val body = JSONObject()
                    .put("p_code", familyCode)
                    .put("p_child_id", childId)
                    .put("p_status", status)
                if (location != null) {
                    body.put("p_latitude", location.latitude)
                    body.put("p_longitude", location.longitude)
                    body.put("p_accuracy_m", location.accuracy.toDouble())
                    body.put("p_provider", location.provider ?: "android")
                } else {
                    body.put("p_latitude", JSONObject.NULL)
                    body.put("p_longitude", JSONObject.NULL)
                    body.put("p_accuracy_m", JSONObject.NULL)
                    body.put("p_provider", JSONObject.NULL)
                }
                postRpcBoolean("casatoda_report_device_location", body)
            } catch (e: Exception) {
                Log.w(TAG, "Falha ao enviar localização", e)
            }
        }
    }

    private fun startSound(context: Context, seconds: Int) {
        handler.post {
            stopSoundNow(context)
            try {
                val audio = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
                previousAlarmVolume = audio.getStreamVolume(AudioManager.STREAM_ALARM)
                audio.setStreamVolume(AudioManager.STREAM_ALARM, audio.getStreamMaxVolume(AudioManager.STREAM_ALARM), 0)

                val uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                    ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
                    ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

                val mp = MediaPlayer()
                mp.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                mp.setDataSource(context, uri)
                mp.isLooping = true
                mp.prepare()
                mp.start()
                player = mp

                val stop = Runnable { stopSoundNow(context) }
                stopSoundRunnable = stop
                handler.postDelayed(stop, seconds * 1000L)
            } catch (e: Exception) {
                Log.w(TAG, "Falha ao tocar som", e)
                stopSoundNow(context)
            }
        }
    }

    private fun stopSound(context: Context) {
        handler.post { stopSoundNow(context) }
    }

    private fun stopSoundNow(context: Context) {
        stopSoundRunnable?.let { handler.removeCallbacks(it) }
        stopSoundRunnable = null
        runCatching { player?.stop() }
        runCatching { player?.release() }
        player = null

        val oldVolume = previousAlarmVolume
        if (oldVolume != null) {
            val audio = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            runCatching { audio.setStreamVolume(AudioManager.STREAM_ALARM, oldVolume, 0) }
        }
        previousAlarmVolume = null
    }

    private fun postRpcBoolean(name: String, body: JSONObject): Boolean {
        val connection = (URL("$SB_URL/rest/v1/rpc/$name").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 7_000
            readTimeout = 7_000
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
        val text = connection.inputStream.bufferedReader().use { it.readText() }.trim()
        connection.disconnect()
        return text == "true"
    }
}
