import type { CongestionZone } from "@/types";
import type { CongestionAdapter } from "./types";

/**
 * Static mock data provider — the ONLY file with hardcoded data.
 *
 * To swap to a real API or Supabase:
 *   1. Create a new adapter file implementing CongestionAdapter
 *   2. Update lib/congestion/index.ts to export it
 *   3. No component changes needed
 *
 * Levels reflect realistic busy weekend patterns in Kyoto.
 */
const MOCK_ZONES: CongestionZone[] = [
  {
    id: "gion-kiyomizudera",
    name: "Gion / Kiyomizudera",
    level: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fushimi-inari",
    name: "Fushimi Inari",
    level: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "arashiyama-sagano",
    name: "Arashiyama / Sagano",
    level: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "central-kawaramachi",
    name: "Central District (Kawaramachi / Karasuma)",
    level: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "kyoto-station",
    name: "Around Kyoto Station",
    level: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nishiki-market",
    name: "Nishiki Market Area",
    level: 3,
    updatedAt: new Date().toISOString(),
  },
];

export const mockAdapter: CongestionAdapter = {
  fetchAllZones: async (): Promise<CongestionZone[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_ZONES;
  },
  fetchZoneById: async (id: string): Promise<CongestionZone | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_ZONES.find((z) => z.id === id) ?? null;
  },
};
