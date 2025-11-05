"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-zinc-100">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 ring-1 ring-blue-500/30">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-blue-400">
                <path fill="currentColor" d="M12 3l7.5 18h-3.2l-1.8-4.5H9.5L7.7 21H4.5L12 3zm0 6.4l-1.7 4.1h3.4L12 9.4z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Assistant</span>
          </div>
          <a href="/" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10">Home</a>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full bg-white/10" />
        </div>
      </header>

      <Chat />
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your clinical AI assistant. How can I help with your medical text or report today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function onSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data?.message) {
        setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "I couldn't get a response from the model. Please check your API key or try again." },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error contacting model. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Submit on Enter (without Shift). Allow Shift+Enter for newlines.
  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) onSend(e);
    }
  }

  // PDF handling: extract text client-side using PDF.js from CDN
  async function extractPdfText(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      let pdfjs;
      try {
        pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs");
      } catch {}
      const lib = pdfjs?.default || pdfjs || {};
      const pdfjsLib = lib.pdfjsLib || lib; // accommodate different export shapes
      if (pdfjsLib?.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";
      const maxPages = Math.min(pdf.numPages, 30); // safety cap
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((it) => (it.str || "")).join(" ");
        fullText += "\n\n" + pageText;
        if (fullText.length > 40000) break; // cap size
      }
      return fullText.trim();
    } catch (e) {
      return "";
    }
  }

  async function onPdfSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }
    setLoading(true);
    try {
      const text = await extractPdfText(file);
      if (!text) {
        setMessages((m) => [...m, { role: "assistant", content: "Couldn't read text from the PDF. Please try another file." }]);
        return;
      }
      // Send the extracted text for analysis
      const userMsg = `Analyze the following PDF content and provide a concise, safe summary with key findings and disclaimers.\n\n${text.slice(0, 20000)}`;
      const next = [...messages, { role: "user", content: userMsg }];
      setMessages(next);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data?.message) {
        setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "I couldn't generate an analysis for that PDF." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error reading the PDF. Please try again." }]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-28 pt-8">
      <div className="flex flex-1 flex-col gap-6">
        {messages.map((m, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-1 h-6 w-6 shrink-0 rounded-full ${m.role === "assistant" ? "bg-white text-black" : "bg-blue-500 text-white"} flex items-center justify-center text-xs font-semibold`}>
              {m.role === "assistant" ? "AI" : "You"}
            </div>
            <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-zinc-100">
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-zinc-400">Assistant is thinking…</div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSend} className="fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black to-black/60 py-4">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your medical question or paste a report…"
              className="min-h-[48px] max-h-40 flex-1 resize-y bg-transparent p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white ring-1 ring-white/15 hover:bg-white/15">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={onPdfSelected}
                className="hidden"
              />
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/10 text-white">📄</span>
              Upload PDF
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-100 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
