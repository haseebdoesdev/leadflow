import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, role } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Check for duplicate email
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  const is_duplicate = !!existing;

  const payload = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone || null,
    company: company || null,
    role: role || null,
    is_duplicate,
  };

  const { error } = await supabase.from("leads").insert(payload);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const n8nRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!n8nRes.ok) {
        const text = await n8nRes.text();
        console.error("n8n webhook returned", n8nRes.status, text);
      }
    } catch (err) {
      console.error("n8n webhook error:", err);
    }
  }

  return NextResponse.json({ success: true, duplicate: is_duplicate });
}
