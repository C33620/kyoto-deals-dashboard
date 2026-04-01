// app/api/telegram-webhook/route.ts
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TEAM_MEMBER_USERNAME = process.env.TEAM_MEMBER_USERNAME!; // add this to your .env

async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: Record<string, unknown>,
) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const message = body?.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text ?? "";

  if (!text.startsWith("/start")) return NextResponse.json({ ok: true });

  const leadToken = text.split(" ")[1];

  if (!leadToken) {
    await sendMessage(chatId, "👋 Welcome! No lead data found.");
    return NextResponse.json({ ok: true });
  }

  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !leads) {
    await sendMessage(chatId, "⚠️ Could not retrieve your data.");
    return NextResponse.json({ ok: true });
  }

  const lead = leads.find(
    (l) => l.email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 64) === leadToken,
  );

  if (!lead) {
    await sendMessage(chatId, "⚠️ No matching lead found for this link.");
    return NextResponse.json({ ok: true });
  }

  const services = lead.custom_props?.services_selected?.join(", ") || "None";

  // ── Prefilled text the client will send to the team member ──
  const handoffText = [
    "Hello! I just came from the intake form.",
    "",
    `Name: ${lead.name || "—"}`,
    `Email: ${lead.email || "—"}`,
    `Telegram: ${lead.telegram || "—"}`,
    `Website: ${lead.website || "—"}`,
    `Social Media: ${lead.social_media || "—"}`,
    `Budget: ${lead.budget || "—"}`,
    `Services: ${services}`,
  ].join("\n");

  const handoffUrl = `https://t.me/${TEAM_MEMBER_USERNAME}?text=${encodeURIComponent(handoffText)}`;

  // ── Summary message sent to the client ──
  const msg = `
👋 <b>Hello ${lead.name}!</b>

Here is a summary of what you submitted:

📧 <b>Email:</b> ${lead.email}
📱 <b>Telegram:</b> ${lead.telegram}
🌐 <b>Website:</b> ${lead.website || "—"}
📣 <b>Social Media:</b> ${lead.social_media || "—"}
💰 <b>Budget:</b> ${lead.budget || "—"}
🛠 <b>Services Selected:</b> ${services}

Tap the button below to open your private chat with our advisor.
Your details will be pre-filled — just tap <b>Send</b>!
  `.trim();

  await sendMessage(chatId, msg, {
    inline_keyboard: [
      [
        {
          text: "💬 Open chat with advisor",
          url: handoffUrl,
        },
      ],
    ],
  });

  return NextResponse.json({ ok: true });
}
