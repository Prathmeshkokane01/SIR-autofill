# SIR Enumeration Form — Auto-Fill Assistant

A full-stack app that lets you upload Voter ID / Aadhaar / other old documents, automatically extracts the required fields with AI, and auto-fills the SIR (Special Intensive Revision) Enumeration Form. You review/edit the extracted data, save it, and download a filled PDF.

**Stack:** Next.js · Google Gemini API (extraction) · PostgreSQL + Prisma (database) · NextAuth.js (login) · PDFKit (PDF export)
**Languages:** Marathi / Hindi / English (switch from the top-right corner)

---

## Local Development (VS Code)

### Step 1 — Prerequisites
- [Node.js](https://nodejs.org) v18+
- A Gemini API key — https://aistudio.google.com/apikey (free, no credit card required)
- A Postgres database — easiest free option: [Neon](https://neon.tech) (sign up → new project → copy the connection string). Vercel Postgres also works (see the deployment section below).

### Step 2 — Install dependencies
```bash
cd sir-autofill
npm install
```

### Step 3 — Environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in:
```
GEMINI_API_KEY=AIzaSy...
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### Step 4 — Set up the database
```bash
npx prisma db push
```

> ⚠️ **If you ever change `prisma/schema.prisma`** (e.g. add a new field), re-run this command to sync the change to your database:
> ```bash
> npx prisma db push
> ```
> For a production database (Vercel/Neon), point `DATABASE_URL` at it temporarily and run the same command, then switch back to your local URL.

### Step 5 — Run
```bash
npm run dev
```
→ http://localhost:3000

---

## Deploying to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial SIR autofill app"
git remote add origin https://github.com/your-username/sir-autofill.git
git branch -M main
git push -u origin main
```

### Step 2 — Create a production database
1. Sign up at https://vercel.com (you can log in with GitHub)
2. Dashboard → **Storage** → **Create Database** → **Postgres**
3. Once created, it's linked to your project automatically and `DATABASE_URL` (and related env vars) get set for you

   (Alternatively, use a free [Neon](https://neon.tech) or [Supabase](https://supabase.com) Postgres and paste its connection string into Vercel's environment variables manually.)

### Step 3 — Import the project
1. Vercel Dashboard → **Add New** → **Project**
2. Select your GitHub repo → **Import**
3. Add these **Environment Variables**:
   - `GEMINI_API_KEY` — your Gemini key
   - `DATABASE_URL` — already set if using Vercel Postgres; otherwise your Neon/Supabase connection string
   - `NEXTAUTH_SECRET` — the same random string you generated locally
   - `NEXTAUTH_URL` — your deployed URL, e.g. `https://sir-autofill.vercel.app`
4. Click **Deploy**

### Step 4 — Push the database schema (first deploy only)
After deploying, from your local terminal (temporarily pointing `.env`'s `DATABASE_URL` at the production database):
```bash
npx prisma db push
```
This creates the tables on the production database. Switch `.env` back to your local `DATABASE_URL` afterward.

Your site will then be live at your Vercel URL, e.g. `https://sir-autofill.vercel.app`.

---

## How to Use

1. **Choose a language** — top-right corner: Marathi / Hindi / English
2. **Photo** — upload a passport-size photo (optional)
3. **Documents** — upload each document one by one with its type (the screen lists exactly which documents are needed), or upload one combined PDF with everything scanned together
4. **Verify** — check the auto-extracted fields (green border), edit anything that needs correcting
5. **Submit** — "Confirm & Save" stores the record in the database; then use **"Download PDF"** to get the filled form as a PDF

---

## Login System

The app uses **email + password login** — each user only sees their own submissions.

- `/signup` — create a new account (name, email, password)
- `/login` — log in to an existing account
- `/` (the main form) and `/submissions` are only accessible when logged in — otherwise you're redirected to `/login`
- Passwords are hashed with `bcrypt` before being stored (never saved as plain text)

`NEXTAUTH_SECRET` is **required** in production — set it as an environment variable on Vercel (generate one with `openssl rand -base64 32`).

---

## Submissions Dashboard (`/submissions`)

- **Search** by name or EPIC number
- **Filter** by status (All / Draft / Submitted)
- **Download PDF** for any saved submission
- **Delete** — permanently removes the submission (and its documents) from the database; ownership is checked server-side, so you can only delete your own records

---

## Project Structure

```
sir-autofill/
├── pages/
│   ├── index.js                    → main 4-step flow
│   ├── login.js, signup.js         → auth pages
│   ├── submissions.js              → dashboard (search / filter / delete)
│   └── api/
│       ├── auth/[...nextauth].js   → NextAuth config
│       ├── auth/signup.js          → account creation
│       ├── extract.js              → AI extraction from uploaded docs (base64, no disk write)
│       ├── upload-photo.js         → passport photo upload (base64)
│       ├── submit.js               → saves the final form to the database
│       ├── submissions.js          → list the logged-in user's submissions
│       ├── submissions/[id].js     → delete a submission
│       └── generate-pdf.js         → generates the filled-form PDF
├── components/
│   ├── Header.jsx, LanguageSwitcher.jsx, LangContext.jsx
│   ├── PhotoUploadStep.jsx, DocumentUploadStep.jsx
│   ├── VerifyStep.jsx, SubmitStep.jsx
│   └── PasswordInput.jsx           → password field with show/hide toggle
├── lib/
│   ├── gemini.js                   → Gemini API extraction logic
│   ├── auth.js                     → NextAuth credentials provider
│   ├── i18n.js                     → Marathi / Hindi / English strings
│   ├── documentTypes.js            → document types + form fields (trilingual)
│   ├── compressImage.js            → client-side image compression before upload
│   └── prisma.js                   → Prisma client singleton
├── prisma/schema.prisma            → Postgres schema (files stored as base64)
├── assets/fonts/                   → Devanagari-capable font used for PDF generation
└── styles/globals.css
```

---

## Notes

- **"Timed out fetching a new connection from the connection pool" error:** usually means multiple `npm run dev` or `npx prisma studio` processes are running at once and exhausting Neon's connection limit. Close all extra terminals/processes and run just one `npm run dev`. `lib/prisma.js` also caps the connection pool at 5 to help prevent this.
- Uploaded documents and the passport photo are stored **as base64 directly in the database** — Vercel's serverless environment doesn't have a persistent filesystem.
- This tool only fills a draft to save you time — always cross-check everything against the official form before submitting on the actual ECI/SIR portal.
- For real production use, consider adding document encryption at rest, since ID proofs are sensitive.
