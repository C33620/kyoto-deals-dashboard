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

// Dashboard-local MVP mapping.
// Important: these ids must match the Kyoto app zone ids exactly.
const ZONE_KEYWORDS: Array<{ zoneId: string; keywords: string[] }> = [
  {
    zoneId: "gion-kiyomizudera",
    keywords: ["gion", "kiyomizu", "higashiyama", "sannenzaka", "ninenzaka"],
  },
  {
    zoneId: "fushimi-inari",
    keywords: ["fushimi inari", "inari", "fukakusa"],
  },
  {
    zoneId: "kinkakuji",
    keywords: ["kinkakuji", "golden pavilion"],
  },
  {
    zoneId: "ryoanji",
    keywords: ["ryoanji"],
  },
  {
    zoneId: "nijo-castle",
    keywords: ["nijo", "nijo castle", "nijojo"],
  },
  {
    zoneId: "tofukuji",
    keywords: ["tofukuji"],
  },
  {
    zoneId: "daitokuji",
    keywords: ["daitokuji"],
  },
  {
    zoneId: "kurama-temple",
    keywords: ["kurama"],
  },
  {
    zoneId: "kamigamo-shrine",
    keywords: ["kamigamo"],
  },
  {
    zoneId: "fushimi-momoyama-castle",
    keywords: ["momoyama castle"],
  },
  {
    zoneId: "arashiyama-sagano",
    keywords: ["arashiyama", "sagano", "ukyo"],
  },
  {
    zoneId: "philosopher-path",
    keywords: ["philosopher", "ginkakuji", "sakyo"],
  },
  {
    zoneId: "fushimi-momoyama",
    keywords: ["fushimi", "sake district"],
  },
  {
    zoneId: "kibune-village",
    keywords: ["kibune", "kifune"],
  },
  {
    zoneId: "kyoto-imperial-park",
    keywords: ["imperial palace", "gosho", "kamigyo"],
  },
  {
    zoneId: "katsura-imperial-villa",
    keywords: ["katsura"],
  },
  {
    zoneId: "nishiki-market",
    keywords: ["nishiki"],
  },
  {
    zoneId: "teramachi-sanjo",
    keywords: ["teramachi", "sanjo"],
  },
  {
    zoneId: "pontocho",
    keywords: ["pontocho", "pontochō"],
  },
  {
    zoneId: "toji-market",
    keywords: ["toji"],
  },
  {
    zoneId: "central-kawaramachi",
    keywords: ["kawaramachi", "karasuma", "nakagyo", "shimogyo"],
  },
  {
    zoneId: "higashiyama",
    keywords: ["higashiyama"],
  },
  {
    zoneId: "nishiki-koji-backstreets",
    keywords: ["nishiki koji", "nishikikoji"],
  },
  {
    zoneId: "fushimi-neighborhood",
    keywords: ["fushimi ward"],
  },
  {
    zoneId: "kyoto-station",
    keywords: ["kyoto station", "kyoto eki", "minami ward"],
  },
];

export const ZONE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "gion-kiyomizudera", label: "Kiyomizudera" },
  { value: "fushimi-inari", label: "Fushimi Inari" },
  { value: "kinkakuji", label: "Kinkakuji" },
  { value: "ryoanji", label: "Ryoanji" },
  { value: "nijo-castle", label: "Nijo Castle" },
  { value: "tofukuji", label: "Tofukuji" },
  { value: "daitokuji", label: "Daitokuji" },
  { value: "kurama-temple", label: "Kurama Temple" },
  { value: "kamigamo-shrine", label: "Kamigamo Shrine" },
  { value: "fushimi-momoyama-castle", label: "Fushimi Momoyama Castle Area" },
  { value: "arashiyama-sagano", label: "Arashiyama / Sagano" },
  { value: "philosopher-path", label: "Philosopher's Path" },
  { value: "fushimi-momoyama", label: "Fushimi Sake District" },
  { value: "kibune-village", label: "Kibune Village" },
  { value: "kyoto-imperial-park", label: "Kyoto Imperial Palace Park" },
  { value: "katsura-imperial-villa", label: "Katsura Imperial Villa Area" },
  { value: "nishiki-market", label: "Nishiki Market Area" },
  { value: "teramachi-sanjo", label: "Teramachi / Sanjo" },
  { value: "pontocho", label: "Pontocho Alley" },
  { value: "toji-market", label: "Toji Temple Market" },
  {
    value: "central-kawaramachi",
    label: "Central District (Kawaramachi / Karasuma)",
  },
  { value: "higashiyama", label: "Higashiyama District" },
  { value: "nishiki-koji-backstreets", label: "Nishiki Koji Backstreets" },
  { value: "fushimi-neighborhood", label: "Fushimi Local Neighborhood" },
  { value: "kyoto-station", label: "Around Kyoto Station" },
];

export function getZoneIdFromAddress(address: string): string | null {
  const normalized = normalizeAddress(address);

  for (const entry of ZONE_KEYWORDS) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.zoneId;
    }
  }

  return null;
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
  zone_id?: string | null;
  existing_id?: string;
}): Promise<{ error?: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const finalUser =
    user ?? (await supabase.auth.getSession()).data.session?.user;

  if (!finalUser) return { error: "Not authenticated" };

  const trimmedVenueName = payload.venue_name.trim();
  const trimmedAddress = payload.address_line.trim();
  const trimmedMapsUrl = payload.google_maps_url.trim();

  const row = {
    owner_user_id: finalUser.id,
    venue_name: trimmedVenueName,
    venue_type: payload.venue_type,
    address_line: trimmedAddress,
    google_maps_url: trimmedMapsUrl,
    normalized_name: normalizeName(trimmedVenueName),
    normalized_address: normalizeAddress(trimmedAddress),
    latitude: null as number | null,
    longitude: null as number | null,
    zone_id: payload.zone_id ?? getZoneIdFromAddress(trimmedAddress),
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

  const { error } = await supabase.from("business_venues").insert(row);

  console.log("Venue insert result:", JSON.stringify(error ?? "success"));

  return { error: error?.message };
}
