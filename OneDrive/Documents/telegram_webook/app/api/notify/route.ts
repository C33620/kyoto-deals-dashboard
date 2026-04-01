import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME!;

const SERVICE_NAMES = [
  "growth_strategy",
  "on_off_ramp",
  "business_model_monetization",
  "fundraising",
  "kol_paid_ads",
  "partnerships_intros",
  "token_listing",
  "ux_ui_product_design",
  "other",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") ?? "";
  const email = searchParams.get("email") ?? "";
  const telegram = searchParams.get("telegram") ?? "";

  const social_media = searchParams.get("social_media") || null;
  const website = searchParams.get("website") || null;

  const budget =
    searchParams.get("brand_buget") || searchParams.get("budget") || null;

  // Detect if Tidio sent one comma-joined string or repeated params
  const rawValues = searchParams.getAll("services_selected");

  const allValues =
    rawValues.length === 1
      ? rawValues[0].split(",").map((s) => s.trim())
      : rawValues.map((s) => s.trim());

  const services_selected = allValues
    .map((val, index) => {
      if (val === "1" || val === "true") return SERVICE_NAMES[index] ?? null;
      if (val && val !== "0" && val !== "false") return val;
      return null;
    })
    .filter(Boolean);

  if (!name || !email || !telegram) {
    return NextResponse.json(
      { error: "name, email and telegram are required" },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin.from("leads").upsert(
    {
      name,
      email,
      telegram,
      social_media,
      website,
      budget,
      custom_props: {
        services_selected,
      },
    },
    { onConflict: "email" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const leadToken = email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 64);

  return NextResponse.redirect(
    `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${leadToken}`,
    302,
  );
}
