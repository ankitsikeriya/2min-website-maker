export const metadata = {
  title: "Blog | Medicap",
  description: "Insights and updates about AI healthcare and product features.",
};

export default function BlogPage() {
  const posts = [
    {
      id: "clinicalbert-intro",
      title: "How ClinicalBERT Helps Understand Medical Text",
      excerpt:
        "We explore how ClinicalBERT embeddings improve understanding of medical terminology in reports and conversations.",
      date: "2025-10-30",
      author: "Medicap Team",
      tags: ["NLP", "Embeddings", "ClinicalBERT"],
    },
    {
      id: "secure-data-handling",
      title: "Secure Data Handling in Your AI Assistant",
      excerpt:
        "A quick overview of our approach to encryption, least-privilege access, and data minimization for safer care.",
      date: "2025-10-22",
      author: "Security",
      tags: ["Security", "Privacy"],
    },
    {
      id: "symptom-triage-basics",
      title: "Basics of AI Symptom Triage",
      excerpt:
        "Triage models help prioritize urgency and offer conservative guidance. Here's how we think about safety.",
      date: "2025-10-15",
      author: "Clinical",
      tags: ["Safety", "Triage"],
    },
  ];

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
            <a href="/" className="hover:text-white">Home</a>
            <a href="/chat" className="hover:text-white">Assistant</a>
            <a href="/blog" className="text-white">Blog</a>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full bg-white/10" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Blog</h1>
          <p className="mt-3 text-zinc-400">Insights, updates, and explainers from the team.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span>{p.author}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{p.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{p.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-400 ring-1 ring-inset ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <a href={`#/blog/${p.id}`} className="mt-5 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
