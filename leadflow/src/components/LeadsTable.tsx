"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import type { Lead } from "@/lib/types";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
        No leads yet. Share your form link to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            {["Name", "Email", "Phone", "Company", "Role", "Status", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
              <td className="px-4 py-3 text-gray-600">{lead.email}</td>
              <td className="px-4 py-3 text-gray-500">{lead.phone ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{lead.company ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{lead.role ?? "—"}</td>
              <td className="px-4 py-3">
                {lead.is_duplicate ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <AlertTriangle className="h-3 w-3" /> Duplicate
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                    <CheckCircle className="h-3 w-3" /> New
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
