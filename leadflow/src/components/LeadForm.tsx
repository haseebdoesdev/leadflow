"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { LeadFormData } from "@/lib/types";

const EMPTY: LeadFormData = { name: "", email: "", phone: "", company: "", role: "" };

export default function LeadForm() {
  const [form, setForm] = useState<LeadFormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMessage(data.duplicate ? "You're already on our list!" : "Thanks! We'll be in touch.");
      setForm(EMPTY);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-500" />
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-brand-600 underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {[
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Work Email", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: false },
        { name: "company", label: "Company", type: "text", required: false },
        { name: "role", label: "Job Title", type: "text", required: false },
      ].map(({ name, label, type, required }) => (
        <div key={name} className="flex flex-col gap-1">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            value={form[name as keyof LeadFormData]}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
          />
        </div>
      ))}

      {status === "error" && (
        <p className="text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Get Early Access
      </button>
    </form>
  );
}
