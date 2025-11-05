https://medi-ai-liart.vercel.app/ visit this link for mvp



# MediCap – AI Health Assistant

MediCap is a minimal, fast Next.js app that helps users understand their health using AI. It includes:

- Conversational chat MedAI.
- A voice assistant widget (Omnidimension) you can open from a floating button.
- Client‑side PDF upload and analysis (extracts text and summarizes key findings).

The goal is to educate, guide, and support users with clear, safe, and empathetic information — not to diagnose or prescribe.

## Features

- Chat at `/chat` with multi‑turn history sent to Gemini.
- Voice assistant button fixed at the bottom‑right with a mic icon.
- PDF upload (client‑side with PDF.js) to extract text and request an AI summary.
- Clean, responsive UI built with Tailwind and the Next.js App Router.

## Tech stack

  [User Voice/Text Input]
        ↓
   (VAPI + Twilio)
        ↓
[Frontend: Next.js Chat Interface]
        ↓
[Backend: Node.js + Express]
        ↓
[AI Engine: Hugging Face Medical Model]
        ↓
[Automation Layer: n8n Workflow]
        ↓
[Database: MongoDB]
        ↓
[User Dashboard & Reports]


## Quick start

1) Install dependencies

```bash
npm install
```

2) Create `.env.local` in the project root and add required environment variables
```

3) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Project structure

- `app/page.js` – Landing page
- `app/chat/page.js` – Chat UI (Enter to send, Shift+Enter for newline, Upload PDF)
- `app/api/chat/route.js` – Server route calling Gemini (multi‑turn, safe preamble, fallback model)
- `app/components/VoiceWidgetButton.js` – Bottom‑right floating voice assistant button and widget script loader
- `app/components/OmniWidgetMount.js` – Click wiring helper to open the widget reliably

## Environment variables

- `GOOGLE_GEMINI_API_KEY` – Your Google Generative Language API key

Restart the dev server after changing env variables.

## How chat works

- The chat UI posts messages to `/api/chat`.
- The API route builds a Gemini request with:
  - A clinical safety system instruction
  - The last ~20 turns of chat history
  - Reasonable generation config and relaxed safety (still safe)
- If the primary model (`gemini-2.5-flash`) yields no response, it falls back to `gemini-1.5-flash`.

Troubleshooting tips:
- If you see a 500 with a Gemini error, verify the API key and model access/quota.
- Ensure the server restarted after adding `.env.local`.

## Voice assistant widget

- The floating button with id `omni-open-widget-btn` opens the Omnidimension widget.
- The script is injected once with id `omnidimension-web-widget`.
- Files:
  - `app/components/VoiceWidgetButton.js`
  - `app/components/OmniWidgetMount.js`

If the widget doesn’t open immediately, we retry briefly until the vendor script is ready.

## PDF analysis

- Click “Upload PDF” in the chat footer to select a PDF.
- We use PDF.js in the browser to extract text (scanned images are not supported without OCR).
- The extracted text is sent to Gemini for a concise, safe summary.

To support scanned PDFs, consider adding OCR (e.g., Tesseract.js) in a future update.

## Deployment

- Any Node‑compatible host (Vercel, Netlify, etc.)
- Ensure `GOOGLE_GEMINI_API_KEY` is set in your hosting provider’s environment.

## Security & privacy

- Do not hardcode API keys in the client. Keys are read server‑side via `.env.local`.
- This demo stores no user data by default; add your own persistence if needed.

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm start` – Start production server

## Roadmap ideas

- OCR support for scanned PDFs
- Source citations and references
- Streaming responses in chat
- Structured outputs for medical sections (vitals, labs, medications)

