plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "br.com.casatoda"
    compileSdk = 35

    defaultConfig {
        applicationId = "br.com.casatoda"
        minSdk = 26
        targetSdk = 35
        versionCode = 8
        versionName = "0.8.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}
