# LeadFlow

A full-stack lead capture and automation demo built for portfolio purposes. A visitor fills out a form → Supabase stores the lead → n8n fires a webhook that fans out to Airtable, Google Sheets, Slack, and Gmail — with duplicate detection built in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Database & Auth | Supabase (Postgres + RLS + Auth) |
| Automation | n8n (self-hosted via Docker) |
| CRM | Airtable |
| Reporting | Google Sheets |
| Alerts | Slack |
| Email | Gmail |
| Hosting | Vercel |

---

## How It Works

```
Visitor fills form
      │
      ▼
Next.js API Route (/api/leads)
      │  checks for duplicate email
      ▼
Supabase (Postgres + RLS)
      │  inserts lead, fires webhook
      ▼
n8n Webhook Trigger
      │
      ├─ is_duplicate = true  ──► Slack: Duplicate Alert
      │
      └─ is_duplicate = false
            │
            ├──► Airtable: Create record in LeadFlow base
            ├──► Google Sheets: Append row to Leads sheet
            ├──► Slack: New lead notification (#leads)
            └──► Gmail: Welcome email to lead
```

---

## Project Structure

```
leadflow/                   Next.js app (deploy to Vercel)
├── src/
│   ├── app/
│   │   ├── page.tsx        Public lead capture form
│   │   ├── dashboard/      Protected admin dashboard
│   │   ├── login/          Supabase auth login
│   │   └── api/leads/      POST endpoint — saves lead + triggers n8n
│   ├── components/
│   │   ├── LeadForm.tsx
│   │   └── LeadsTable.tsx
│   ├── lib/supabase/       Browser + server Supabase clients
│   └── middleware.ts       Auth guard for /dashboard
├── supabase/schema.sql     Run once in Supabase SQL editor
└── .env.local.example      Copy → .env.local and fill in values

docker-compose.yml          Spins up n8n at localhost:5678
n8n-workflows/              Importable workflow JSON (backup copy)
```

---

## Local Setup

### 1. Supabase

The database is already provisioned. Run the schema once:

- Open your Supabase project → **SQL Editor**
- Paste and run `leadflow/supabase/schema.sql`
- Copy your **Project URL** and **anon key** from Project Settings → API

### 2. n8n (Docker)

```bash
# from repo root
docker compose up -d
```

Open `http://localhost:5678` and connect credentials:

| Credential | Type in n8n |
|---|---|
| Airtable | Personal Access Token |
| Google Sheets | OAuth2 |
| Slack | Bot Token (OAuth2) |
| Gmail | OAuth2 |

> The workflow **LeadFlow — New Lead Automation** is already created in your n8n instance. Open it, connect the credentials above, then activate it.

After activating, copy the webhook URL (looks like `http://localhost:5678/webhook/lead-received`) into your `.env.local`.

For Vercel deployments, expose n8n publicly with:
```bash
npx ngrok http 5678
```

### 3. Next.js app

```bash
cd leadflow
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, N8N_WEBHOOK_URL

npm install
npm run dev
```

Visit `http://localhost:3000` — submit the form, check Airtable + Slack.

### 4. Google Sheets

- Create a new Google Sheet named **LeadFlow**
- Add a sheet tab called **Leads** with headers: `ID, Name, Email, Phone, Company, Role, Date`
- In n8n → **Log Lead to Google Sheets** node → replace `REPLACE_WITH_YOUR_SHEET_ID` with your sheet's ID (from the URL)

---

## Deployment (Vercel)

The Next.js app is deployed on Vercel. Add these environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
N8N_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/lead-received
```

---

## Dashboard Access

The `/dashboard` route is protected by Supabase Auth.

1. Go to your Supabase project → **Authentication → Users**
2. Click **Add user** → create an email/password account
3. Visit `<your-domain>/login` and sign in

---

## Features

- **Duplicate detection** — same email submitted twice? n8n catches it, skips Airtable/Sheets/Gmail, and pings Slack with a duplicate alert
- **RLS policies** — anon users can insert leads, only authenticated users can read them
- **Real-time dashboard** — admin view shows all leads with new/duplicate status badges and stats

---

## License

MIT
