package br.com.lousadeestudos;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://edumarttiins.github.io/lousa-de-estudos/v52.html?androidapp=1&apk=3";
    private WebView webView;

    private static final String HIDE_INSTALL_UI_JS =
            "(function(){" +
            "window.__lousaPwaV52=true;" +
            "var selector='.v52InstallBanner,.v51InstallBanner,.v39InstallOverlay,.v33PwaPrompt';" +
            "var css=selector+'{display:none!important;visibility:hidden!important;pointer-events:none!important}';" +
            "var s=document.getElementById('androidNativeAppCSS');" +
            "if(!s){s=document.createElement('style');s.id='androidNativeAppCSS';document.head.appendChild(s);}" +
            "s.textContent=css;" +
            "document.querySelectorAll(selector).forEach(function(e){e.remove();});" +
            "document.documentElement.classList.add('android-native-app');" +
            "})();";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.rgb(47, 157, 89));
        getWindow().setNavigationBarColor(Color.WHITE);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(243, 248, 245));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " LousaDeEstudosAndroid/1.2");

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if (host != null && host.endsWith("github.io")) {
                    return false;
                }
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                hideInstallUi(view);
                view.postDelayed(() -> hideInstallUi(view), 800);
                view.postDelayed(() -> hideInstallUi(view), 2400);
                view.postDelayed(() -> hideInstallUi(view), 5000);
            }
        });

        if (savedInstanceState == null) {
            webView.loadUrl(APP_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void hideInstallUi(WebView view) {
        if (view != null) {
            view.evaluateJavascript(HIDE_INSTALL_UI_JS, null);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
