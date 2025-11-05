"use client";
import VoiceWidgetButton from "./components/VoiceWidgetButton";
import OmniWidgetMount from "./components/OmniWidgetMount";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 ring-1 ring-blue-500/30">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-blue-400">
                <path fill="currentColor" d="M12 3l7.5 18h-3.2l-1.8-4.5H9.5L7.7 21H4.5L12 3zm0 6.4l-1.7 4.1h3.4L12 9.4z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Vetra</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#" className="hover:text-white">Services</a>
            <a href="#" className="hover:text-white">Assistant</a>
            <a href="#" className="hover:text-white">How it Works</a>
            <a href="#" className="hover:text-white">Log In</a>
            <a href="/blog" className="hover:text-white">Blog</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 md:inline-flex">
              <span className="mr-2">🎁</span> Get Started
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full bg-white/10" />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 text-center">
        <div className="mb-8 inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10">
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">✨</span>
          Your AI Health Assistant is here.
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
          Your AI health
          <br className="hidden sm:block" />
          companion — powered
          <br className="hidden sm:block" />
          by understanding
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
          An AI-powered health assistant that listens, understands, and explains your medical reports — making healthcare simple, personal, and stress-free.
        </p>

        <div className="mt-10">
          <a href="/chat" className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-black shadow-sm hover:bg-zinc-100">
            <span className="mr-2">🎁</span> Get Started
          </a>
        </div>

        <div className="mt-10 flex items-center gap-10 text-sm text-zinc-400">
          <span>Instant Reports</span>
          <span>Voice Assistant</span>
          <span>Personal Guidance</span>
        </div>

        {/* Features Section */}
        <section className="mt-24 w-full">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Features</h2>
            <p className="mt-3 text-balance text-zinc-400">
              Everything you need to understand, manage, and improve your health — all in one smart assistant
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm ring-1 ring-inset ring-white/10">
              <h3 className="text-white/90 font-semibold">Conversational Interface</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Speak or type — your AI assistant listens, understands, and helps in the way that feels most natural to you.
              </p>
              <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                Book me an appointment with Dental Clinic
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm ring-1 ring-inset ring-white/10">
              <h3 className="text-white/90 font-semibold">Appointments Scheduling</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Schedule doctor visits, dental cleanings, and specialist consultations.
              </p>
              <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                "Schedule my annual checkup with Dr. Smith next week"
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm ring-1 ring-inset ring-white/10">
              <h3 className="text-white/90 font-semibold">Report Understanding</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Upload your report — the assistant reads, explains, and helps you understand what it really means, in simple language.
              </p>
              <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                Your hemoglobin and sugar levels are normal, but your Vitamin D is slightly low
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm ring-1 ring-inset ring-white/10 lg:col-span-1">
              <h3 className="text-white/90 font-semibold">Secure data handling</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Your health data is encrypted, private, and protected at every step.
              </p>
              <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                When you upload a medical report, everything is stored using advanced encryption.
              </div>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm ring-1 ring-inset ring-white/10 lg:col-span-1">
              <h3 className="text-white/90 font-semibold">Symptom Triage</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                AI-powered assessment that helps you understand your symptoms and offers conservative guidance.
              </p>
              <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                The AI evaluates user-reported symptoms and provides safe recommendations
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mount helper to wire the button click to the widget */}
      <OmniWidgetMount />
      {/* Fixed bottom-right voice assistant button */}
      <VoiceWidgetButton />
    </div>
  );
}

