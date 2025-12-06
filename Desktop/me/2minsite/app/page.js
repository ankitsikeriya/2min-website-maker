"use client";

import { useMemo, useRef, useState } from "react"; 

function buildSrcDoc(html, css, js) { 
  const safeHtml = String(html || ""); 
  const safeCss = String(css || "");
  const safeJs = String(js || "");
  return `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><style>${safeCss}</style></head><body>${safeHtml}<script>${safeJs}<\/script></body></html>`;
} 
 
function base64ToBlob(base64, contentType = "application/zip") {
  if (!base64) return null; 
  const byteChars = atob(base64); 
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i); 
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export default function Home() {
  const [mode, setMode] = useState("prompt") ;
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const srcDoc = useMemo(() => {
    if (!result) return "";
    return buildSrcDoc(result.html, result.css, result.js);
  }, [result]);
 
  const previewWrapRef = useRef(null);

  async function generate() {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const payload = mode === "prompt"
        ? { mode, prompt, provider: "gemini" }
        : { mode, url };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      setResult(data);
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function enterFullScreen() {
    const el = previewWrapRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
        return;
      }
    } catch (e) {
      // fall through to window fallback
    }
    try {
      const win = window.open("", "_blank");
      if (win) {
        win.document.open();
        win.document.write(srcDoc || "");
        win.document.close();
        win.focus();
      }
    } catch (_) {}
  }

  function downloadZip() {
    if (!result?.zipBase64) return;
    const blob = base64ToBlob(result.zipBase64);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result?.filename || "2minsite.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">2 min site</h1>
          <p className="opacity-80">Generate a full static site from a prompt or a reference URL.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="rounded-xl border border-black/10 dark:border-white/15 p-4 bg-white dark:bg-black">
            <div className="mb-4 flex gap-2">
              <button
                className={`rounded-full px-4 py-2 text-sm border ${mode === "prompt" ? "bg-foreground text-background" : "border-black/10 dark:border-white/15"}`}
                onClick={() => setMode("prompt")}
              >
                From Prompt
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm border ${mode === "url" ? "bg-foreground text-background" : "border-black/10 dark:border-white/15"}`}
                onClick={() => setMode("url")}
              >
                From URL
              </button>
            </div>

            {mode === "prompt" ? (
              <div className="flex flex-col gap-3">
                <textarea
                  className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-transparent p-3"
                  rows={8}
                  placeholder="Describe the site you want (e.g., A sleek landing page for a fitness app with hero, features, and CTA)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  className="w-full rounded-lg border  border-black/10 dark:border-white/15 bg-transparent p-3"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center  gap-3">
              <button
                onClick={generate}
                disabled={loading || (mode === "prompt" ? prompt.trim().length < 3 : url.trim().length < 8)}
                className="rounded-lg bg-foreground text-background px-4 py-2 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
              {result?.zipBase64 ? (
                <button onClick={downloadZip} className="rounded-lg border px-4 py-2 border-black/10 dark:border-white/15">
                  Download ZIP
                </button>
              ) : null}
              {!result?.zipBase64 && result ? (
                <span className="text-sm opacity-70">ZIP will be available once dependency install completes.</span>
              ) : null}
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            ) : null}
          </section>

          <section className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden lg:sticky lg:top-6">
            <div className="flex items-center justify-between p-3 text-sm bg-black/5 dark:bg-white/5">
              <span>Preview</span>
              <div className="flex items-center gap-3">
                <button onClick={enterFullScreen} className="rounded-md border px-2 py-1 border-black/10 dark:border-white/15 hover:bg-black/10 dark:hover:bg-white/10">
                  Full Screen
                </button>
                <span className="opacity-70">index.html</span>
              </div>
            </div>
            <div ref={previewWrapRef} className="w-full">
              {result ? (
                <iframe
                  title="preview"
                  className="w-full h-[70vh] bg-white"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={srcDoc}
                />
              ) : (
                <div className="h-[70vh] w-full bg-white/50 dark:bg-black/20 flex items-center justify-center text-sm opacity-70">
                  Preview will appear here after generation.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
