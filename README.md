# SIR गणना प्रपत्र — Auto-Fill Assistant

Voter ID / Aadhaar / जुने कागदपत्रे upload करून SIR Enumeration Form auto-extract + auto-fill करणारं full-stack app.
**Next.js + Google Gemini API (extraction) + Postgres (database) + PDF export**
भाषा: **मराठी / हिंदी / English** (वरच्या उजव्या कोपऱ्यात switch करता येतो)

---

## Local development (VS Code)

### Step 1 — Prerequisites
- [Node.js](https://nodejs.org) v18+
- Gemini API key: https://aistudio.google.com/apikey (free, credit card लागत नाही)
- Postgres database — सर्वात सोपा free पर्याय: [Neon](https://neon.tech) (sign up → naveen project → connection string copy) किंवा Vercel Postgres (खाली बघा)

### Step 2 — Install
```bash
cd sir-autofill
npm install
```

### Step 3 — Environment variables
```bash
cp .env.example .env
```
`.env` उघडून भर:
```
GEMINI_API_KEY=AIzaSy...
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### Step 4 — Database तयार कर
```bash
npx prisma migrate dev --name init
```

> ⚠️ **schema.prisma मध्ये पुढेमागे बदल केलास (नवीन fields जोडलेस) तर प्रत्येक वेळी हा command परत चालवावा लागतो:**
> ```bash
> npx prisma migrate dev --name <describe-the-change>
> ```
> उदा. `npx prisma migrate dev --name add_grandparents_fields`
> Production (Vercel/Neon) च्या DB वर हाच बदल पाठवायला:
> ```bash
> npx prisma migrate deploy
> ```
> (हे production चा `DATABASE_URL` वापरून चालवावं लागतं — local `.env` मध्ये temporarily production URL टाकून चालव, मग परत local URL ने बदल.)

### Step 5 — Run
```bash
npm run dev
```
→ http://localhost:3000

---

## Vercel वर Deploy करणे

### Step 1 — GitHub वर push कर
```bash
git init
git add .
git commit -m "Initial SIR autofill app"
```
GitHub वर एक नवीन repository तयार कर, मग:
```bash
git remote add origin https://github.com/tumcha-username/sir-autofill.git
git branch -M main
git push -u origin main
```

### Step 2 — Database तयार कर (Vercel Postgres)
1. https://vercel.com वर account बनव (GitHub ने login करता येतो)
2. Dashboard → **Storage** → **Create Database** → **Postgres** निवड
3. Database तयार झाल्यावर तो तुमच्या project ला automatically जोडला जातो आणि `DATABASE_URL`, `POSTGRES_URL` इ. environment variables आपोआप set होतात

   (पर्यायी: [Neon](https://neon.tech) किंवा [Supabase](https://supabase.com) चा free Postgres वापरून त्याची connection string manually Vercel च्या env variables मध्ये टाकू शकतोस)

### Step 3 — Project Import कर
1. Vercel Dashboard → **Add New** → **Project**
2. तुमचा GitHub repo निवड → **Import**
3. **Environment Variables** मध्ये भर:
   - `GEMINI_API_KEY` → तुमची Gemini key
   - `DATABASE_URL` → (Vercel Postgres वापरत असशील तर आधीच auto-set असेल, नसेल तर Neon/Supabase ची connection string टाक)
4. **Deploy** दाब

### Step 4 — Database schema push कर (पहिल्यांदाच)
Deploy झाल्यावर, तुमच्या local terminal मधून (production `DATABASE_URL` वापरून):
```bash
npx prisma migrate deploy
```
किंवा Vercel च्या "Build Command" मध्ये आधीच `prisma generate && next build` सेट आहे (package.json मध्ये), पण tables तयार करण्यासाठी `migrate deploy` एकदा manually run करणं गरजेचं आहे — local `.env` मध्ये production चा `DATABASE_URL` टाकून वरचा command चालव, मग परत local URL ने बदल.

Deploy झाल्यावर तुमची site अशा link वर live असेल: `https://tumcha-project.vercel.app`

---

## वापर कसा करायचा

1. **भाषा निवड** — वरच्या उजव्या कोपऱ्यात मराठी/हिंदी/English मधून निवड
2. **फोटो** — पासपोर्ट साईज फोटो अपलोड कर (optional)
3. **Documents** — एक-एक करून प्रत्येक document त्याच्या प्रकारासह अपलोड कर (कोणकोणती कागदपत्रे लागतील ते स्क्रीनवरच दाखवलेलं असतं), किंवा सर्व एकत्र स्कॅन केलेली एक PDF अपलोड कर
4. **Verify** — auto-extract झालेले field (हिरवी border) तपासून घे, गरज असल्यास edit कर
5. **Submit** — "Confirm & Save" दाबलं की माहिती database मध्ये save होते, त्यानंतर **"PDF डाउनलोड करा"** बटणाने भरलेल्या फॉर्मची PDF मिळते

---

## Project Structure

```
sir-autofill/
├── pages/
│   ├── index.js              → मुख्य 4-step flow
│   ├── submissions.js        → saved records बघायला
│   └── api/
│       ├── extract.js        → documents वाचून AI extraction (base64, no disk write)
│       ├── upload-photo.js   → passport photo upload (base64)
│       ├── submit.js         → final form DB मध्ये save
│       ├── submissions.js    → saved records fetch
│       └── generate-pdf.js   → भरलेल्या फॉर्मची PDF तयार करतो
├── components/
│   ├── Header.jsx, LanguageSwitcher.jsx, LangContext.jsx
│   ├── PhotoUploadStep.jsx, DocumentUploadStep.jsx
│   ├── VerifyStep.jsx, SubmitStep.jsx
├── lib/
│   ├── gemini.js              → Gemini API extraction logic
│   ├── i18n.js                → मराठी/हिंदी/English strings
│   ├── documentTypes.js       → document types + form fields (त्रिभाषिक)
│   └── prisma.js              → DB client
├── prisma/schema.prisma       → Postgres schema (files base64 म्हणून DB मध्ये)
└── styles/globals.css
```

---

## लक्षात ठेव

- Uploaded documents आणि photo **base64 म्हणून थेट database मध्ये** save होतात — Vercel च्या serverless environment मध्ये disk persistent नसतो म्हणून
- हे tool फक्त तुमचा वेळ वाचवण्यासाठी draft भरतं — प्रत्यक्ष ECI/SIR पोर्टलवर submit करण्यापूर्वी सर्व माहिती अधिकृत फॉर्मशी manually जुळवून बघ
- Production साठी: auth (login) आणि document encryption जोडायचा विचार कर, कारण ID proofs sensitive असतात
