import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeadsTable from "@/components/LeadsTable";
import { LogOut, Users, AlertTriangle, TrendingUp } from "lucide-react";
import type { Lead } from "@/lib/types";

async function signOut() {
  "use server";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (leads as Lead[]) ?? [];
  const duplicates = all.filter((l) => l.is_duplicate).length;
  const newLeads = all.length - duplicates;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LeadFlow Dashboard</h1>
            <p className="text-sm text-gray-500">All leads synced via n8n</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Leads", value: all.length, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "New", value: newLeads, icon: TrendingUp, color: "text-brand-600 bg-brand-50" },
            { label: "Duplicates", value: duplicates, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Integration badges */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {["Airtable synced", "Google Sheets synced", "Slack notified", "Gmail sent"].map((b) => (
            <span key={b} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-gray-500 shadow-sm">
              {b}
            </span>
          ))}
        </div>

        <LeadsTable leads={all} />
      </div>
    </main>
  );
}
