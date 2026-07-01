# LeadFlow

> A full-stack lead capture and automation system — built as a portfolio demo showcasing modern web + workflow automation integration.

**Live demo:** https://leadflow-three-tau.vercel.app

---

## What it does

A visitor submits a contact form → the lead is saved to Supabase → n8n fires and fans out to four services simultaneously:

- **Airtable** — creates a CRM record
- **Google Sheets** — appends a row for reporting
- **Slack** — sends a `#leads` channel notification
- **Gmail** — sends a welcome email to the lead

Duplicate emails are detected before any of that happens — duplicates get flagged in the database and trigger a separate Slack alert instead.

---

## Architecture

```
                    ┌─────────────────────────┐
                    │   leadflow-three-tau     │
                    │   .vercel.app            │
                    │                          │
                    │  / ──── Lead Form        │
                    │  /dashboard ── Admin     │
                    │  /login ─── Supabase     │
                    └────────────┬────────────┘
                                 │ POST /api/leads
                    ┌────────────▼────────────┐
                    │        Supabase          │
                    │  Postgres + Auth + RLS   │
                    │  duplicate check here    │
                    └────────────┬────────────┘
                                 │ webhook
                    ┌────────────▼────────────┐
                    │          n8n             │
                    │  Normalize Lead Data     │
                    │         │                │
                    │   Is Duplicate?          │
                    │   ├─ YES → Slack alert   │
                    │   └─ NO  ──────────────┐ │
                    │          │             │ │
                    │        Airtable  Sheets│ │
                    │        Slack     Gmail │ │
                    └────────────────────────┘─┘
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Database | Supabase — Postgres + Row Level Security |
| Auth | Supabase Auth (email/password) |
| Automation | n8n Cloud |
| CRM | Airtable |
| Reporting | Google Sheets |
| Notifications | Slack |
| Email | Gmail |
| Hosting | Vercel |

---

## Project structure

```
leadflow/                        Next.js app
├── src/
│   ├── app/
│   │   ├── page.tsx             Public lead capture form
│   │   ├── dashboard/page.tsx   Protected admin dashboard
│   │   ├── login/page.tsx       Auth page
│   │   └── api/leads/route.ts   POST endpoint
│   ├── components/
│   │   ├── LeadForm.tsx
│   │   └── LeadsTable.tsx
│   ├── lib/supabase/            Browser + server clients
│   └── middleware.ts            Auth guard
├── supabase/schema.sql          DB schema + RLS policies
└── .env.local.example

docker-compose.yml               Local n8n (optional)
n8n-workflows/                   Exportable workflow JSON
```

---

## Running locally

### 1. Clone and install

```bash
git clone https://github.com/haseebdoesdev/leadflow.git
cd leadflow/leadflow
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yueekwequamrgkzztdey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/lead-received
```

### 3. Database

Run [`supabase/schema.sql`](leadflow/supabase/schema.sql) in the Supabase SQL editor — creates the `leads` table with RLS policies.

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

### 5. n8n (optional — local)

```bash
# from repo root
docker compose up -d
# → http://localhost:5678
# Import n8n-workflows/lead-automation.json
```

---

## n8n workflow

The workflow (`n8n-workflows/lead-automation.json`) has 8 nodes:

```
Webhook → Normalize Data → Is Duplicate?
                               ├── true  → Slack duplicate alert
                               └── false → Airtable
                                         → Google Sheets
                                         → Slack new lead
                                         → Gmail welcome email
```

Credentials needed in n8n: Airtable PAT, Google OAuth2 (Sheets + Gmail), Slack Bot Token.

---

## Dashboard

The `/dashboard` route is protected by Supabase Auth. To create an admin account:

1. Supabase dashboard → **Authentication → Users → Add user**
2. Visit `/login` on the live site

---

## Deployment

Deployed on Vercel. Environment variables set via CLI:

```bash
cd leadflow
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add N8N_WEBHOOK_URL production
vercel --prod
```

---

## License

MIT
