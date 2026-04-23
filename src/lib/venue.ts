import { createClient } from "@/lib/supabase/client";
import type { BusinessVenue, VenueType } from "@/types";

// Normalize text for matching against Overpass map data
// Lowercases, strips punctuation, collapses spaces
export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAddress(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Validate Google Maps URL format
export function isValidGoogleMapsUrl(url: string): boolean {
  return (
    url.startsWith("https://maps.google.com") ||
    url.startsWith("https://www.google.com/maps") ||
    url.startsWith("https://goo.gl/maps") ||
    url.startsWith("https://maps.app.goo.gl")
  );
}

// Fetch the current user's venue (null if none registered yet)
export async function getUserVenue(): Promise<BusinessVenue | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("business_venues")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();

  return data ?? null;
}

// Save venue — inserts if none exists, updates if already registered
export async function saveVenue(payload: {
  venue_name: string;
  venue_type: VenueType;
  address_line: string;
  google_maps_url: string;
  existing_id?: string;
}): Promise<{ error?: string }> {
  const supabase = createClient();

  // getUser() can return null if the session cookie hasn't synced yet —
  // fall back to getSession() which reads from local storage
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const finalUser =
    user ?? (await supabase.auth.getSession()).data.session?.user;

  if (!finalUser) return { error: "Not authenticated" };

  const row = {
    owner_user_id: finalUser.id,
    venue_name: payload.venue_name.trim(),
    venue_type: payload.venue_type,
    address_line: payload.address_line.trim(),
    google_maps_url: payload.google_maps_url.trim(),
    normalized_name: normalizeName(payload.venue_name),
    normalized_address: normalizeAddress(payload.address_line),
    status: "active",
  };

  if (payload.existing_id) {
    const { error } = await supabase
      .from("business_venues")
      .update(row)
      .eq("id", payload.existing_id)
      .eq("owner_user_id", finalUser.id);

    return { error: error?.message };
  }

  // Insert new venue
  const { error } = await supabase.from("business_venues").insert(row);

  console.log("Venue insert result:", JSON.stringify(error ?? "success"));

  return { error: error?.message };
}
