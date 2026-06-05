package com.example

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Professional status bar and navigation bar system color branding
        window.statusBarColor = android.graphics.Color.parseColor("#1A7C6E")
        window.navigationBarColor = android.graphics.Color.parseColor("#1A7C6E")
        
        setContent {
            MyApplicationTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    WebViewScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun WebViewScreen(modifier: Modifier = Modifier) {
    var webView by remember { mutableStateOf<WebView?>(null) }

    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                // Production-grade configuration to handle single-page apps
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    loadWithOverviewMode = true
                    useWideViewPort = true
                    cacheMode = WebSettings.LOAD_DEFAULT
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                }
                
                // Chrome handler for general actions
                webChromeClient = WebChromeClient()

                // High-fidelity page routing of embedded resources & WhatsApp linkage
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                        // Crucial fix: WhatsApp, Telephone, and Email scheme handlers must launch native Android intents!
                        if (url.startsWith("whatsapp:") || 
                            url.contains("wa.me") || 
                            url.contains("api.whatsapp.com") || 
                            url.startsWith("tel:") || 
                            url.startsWith("mailto:")
                        ) {
                            try {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                            } catch (e: Exception) {
                                e.printStackTrace()
                            }
                            return true
                        }
                        
                        // Keep internal site routing and filters within the WebView container
                        return false
                    }
                }

                webView = this
                
                // Load local assets copied through the preBuild task
                loadUrl("file:///android_asset/index.html")
            }
        },
        update = {
            // Keep the updated view reference alive
        }
    )

    // Hardware back press navigation logic: prevents the app from closing when sub-drawers are active
    val backEnabled = webView?.canGoBack() == true
    BackHandler(enabled = true) {
        webView?.let { wv ->
            if (wv.canGoBack()) {
                wv.goBack()
            } else {
                val activity = wv.context as? ComponentActivity
                activity?.finish()
            }
        }
    }
}
