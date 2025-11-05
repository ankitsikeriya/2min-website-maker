"use client";

import { useEffect } from "react";

export default function OmniWidgetMount() {
  useEffect(() => {
    const btn = document.getElementById("omni-open-widget-btn");
    if (!btn) return;

    const tryOpen = () => {
      const w = typeof window !== "undefined" ? window : undefined;
      // Try common globals the widget may expose
      if (w?.OmnidimWidget?.open) {
        try { w.OmnidimWidget.open(); return; } catch {}
      }
      if (w?.OmnidimWidget?.init) {
        try { w.OmnidimWidget.init(); return; } catch {}
      }
      if (w?.Omnidim?.open) {
        try { w.Omnidim.open(); return; } catch {}
      }
    };

    // Bind click to ensure something happens even if vendor didn't attach
    const onClick = (e) => {
      e.preventDefault();
      // small retry loop in case script isn't ready yet
      let tries = 0;
      const tick = () => {
        tries += 1;
        const before = performance.now();
        tryOpen();
        if (tries < 15) setTimeout(tick, Math.max(120 - (performance.now() - before), 40));
      };
      tick();
    };

    btn.addEventListener("click", onClick, { passive: false });
    return () => btn.removeEventListener("click", onClick);
  }, []);

  return null;
}
