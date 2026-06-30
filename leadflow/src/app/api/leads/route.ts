import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, role } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const supabase = await createClient();

  // Check for duplicate email
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  const is_duplicate = !!existing;

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      company: company || null,
      role: role || null,
      is_duplicate,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
  }

  // Fire-and-forget: trigger n8n webhook
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead }),
    }).catch((err) => console.error("n8n webhook error:", err));
  }

  return NextResponse.json({ success: true, duplicate: is_duplicate, id: lead.id });
}
