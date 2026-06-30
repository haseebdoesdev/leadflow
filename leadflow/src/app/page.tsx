import LeadForm from "@/components/LeadForm";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Zap className="h-4 w-4" />
            Powered by n8n automation
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            LeadFlow
          </h1>
          <p className="mt-3 text-gray-500">
            Submit your details. Our n8n workflow syncs you to Airtable,
            Google Sheets, and pings our Slack — instantly.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <LeadForm />
        </div>

        {/* Tech badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {["Supabase", "n8n", "Airtable", "Google Sheets", "Slack", "Gmail"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <a href="/login" className="underline hover:text-gray-600">
            Admin dashboard →
          </a>
        </p>
      </div>
    </main>
  );
}
