"use client";

import { useEffect, useRef } from "react";

export default function VoiceWidgetButton() {
  const loadingRef = useRef(false);

  useEffect(() => {
    const existing = document.getElementById("omnidimension-web-widget");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.async = true;
    script.src = "https://backend.omnidim.io/web_widget.js?secret_key=e3736284b5bd5c3371f2f4f68962073a";
    document.body.appendChild(script);
  }, []);

  const loadScriptIfNeeded = () => {
    const w = typeof window !== "undefined" ? window : undefined;
    if (w?.OmnidimWidget || w?.Omnidim) return Promise.resolve();
    if (loadingRef.current) return Promise.resolve();
    loadingRef.current = true;
    return new Promise((resolve) => {
      const existing = document.getElementById("omnidimension-web-widget");
      if (existing) {
        // Wait a tick for the vendor to attach globals
        setTimeout(resolve, 50);
        return;
      }
      const script = document.createElement("script");
      script.id = "omnidimension-web-widget";
      script.async = true;
      script.src = "https://backend.omnidim.io/web_widget.js?secret_key=e3736284b5bd5c3371f2f4f68962073a";
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await loadScriptIfNeeded();
    let attempts = 0;
    const tryOpen = () => {
      attempts += 1;
      const w = typeof window !== "undefined" ? window : undefined;
      try {
        if (w?.OmnidimWidget?.open) { w.OmnidimWidget.open(); return true; }
        if (w?.OmnidimWidget?.init) { w.OmnidimWidget.init(); return true; }
        if (w?.Omnidim?.open) { w.Omnidim.open(); return true; }
      } catch {}
      return false;
    };
    if (tryOpen()) return;
    const loop = () => {
      if (tryOpen()) return;
      if (attempts < 15) setTimeout(loop, 150);
    };
    loop();
  };

  return (
    <button
      id="omni-open-widget-btn"
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-blue-400/30 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
      aria-label="Voice Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 14a3 3 0 0 0 3-3V6a 3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V20H8v2h8v-2h-3v-2.08A7 7 0 0 0 19 11h-2z"/>
      </svg>
      <span>Voice Assistant</span>
    </button>
  );
}

