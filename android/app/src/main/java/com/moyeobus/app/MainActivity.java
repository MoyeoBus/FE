package com.moyeobus.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.view.View;
import android.view.ViewGroup;

import com.getcapacitor.BridgeActivity;

import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // 1) 시스템 바(상태바/네비바) 뒤까지 컨텐츠를 그리도록 설정
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    WebSettings settings = getBridge().getWebView().getSettings();
    settings.setTextZoom(100);

    // 2) 루트 뷰에 WindowInsets 리스너 달기
    ViewGroup rootView = findViewById(android.R.id.content);
    if (rootView != null && rootView.getChildCount() > 0) {
      // android.R.id.content 의 첫 번째 자식이 우리가 쓴 CoordinatorLayout
      View content = rootView.getChildAt(0);

      ViewCompat.setOnApplyWindowInsetsListener(content, (view, insets) -> {
        int typeMask = WindowInsetsCompat.Type.statusBars()
            | WindowInsetsCompat.Type.navigationBars();

        Insets systemBars = insets.getInsets(typeMask);

        // 시스템바(insets)만큼 padding을 줘서
        // WebView(React)는 안전영역 안에서만 그려지게 됨
        view.setPadding(
            view.getPaddingLeft(),
            systemBars.top,      // 상태바 높이
            view.getPaddingRight(),
            systemBars.bottom    // 제스처바/네비바 높이
        );

        return insets;
      });
    }
  }
}
