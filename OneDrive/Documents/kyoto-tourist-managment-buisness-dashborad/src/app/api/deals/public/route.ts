import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/deals/public
 *
 * Public endpoint — no auth required.
 * Returns all active, non-expired deals with venue data.
 * Safe for the tourist map app to poll every ~3 minutes.
 *
 * Response shape: PublicActiveDeal[]
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_active_deals")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Public deals fetch error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? [], {
    status: 200,
    headers: {
      // Allow tourist app to call this from any origin
      "Access-Control-Allow-Origin": "*",
      // Cache for 60s at CDN level — tourist app still polls every 3 min
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
