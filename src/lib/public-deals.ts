import { createClient } from "@/lib/supabase/client";

/**
 * Fetches all currently active deals for the tourist map app.
 * Reads from the `public_active_deals` view — safe, filtered,
 * no auth required. The tourist app should poll this every ~3 minutes.
 */
export async function getPublicActiveDeals() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("public_active_deals")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getPublicActiveDeals error:", error.message);
    return [];
  }

  return data ?? [];
}
