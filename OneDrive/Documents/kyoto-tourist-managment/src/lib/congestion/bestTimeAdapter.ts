import type { CongestionZone } from "@/types";
import type { CongestionAdapter } from "./types";

/**
 * BestTime.app adapter — fetches real crowd data via
 * the internal Next.js API route /api/congestion.
 *
 * The API key stays server-side in the route handler.
 * Components never see the key.
 */
export const bestTimeAdapter: CongestionAdapter = {
  fetchAllZones: async (): Promise<CongestionZone[]> => {
    const res = await fetch("/api/congestion");
    if (!res.ok) throw new Error("Failed to fetch congestion data");
    return res.json();
  },

  fetchZoneById: async (id: string): Promise<CongestionZone | null> => {
    const zones = await bestTimeAdapter.fetchAllZones();
    return zones.find((z) => z.id === id) ?? null;
  },
};
