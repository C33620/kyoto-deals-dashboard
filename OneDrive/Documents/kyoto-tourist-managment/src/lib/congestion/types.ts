import type { CongestionZone } from "@/types";

/**
 * The adapter interface every provider must implement.
 * Components only ever import from `lib/congestion/index.ts`.
 */
export interface CongestionAdapter {
  fetchAllZones: () => Promise<CongestionZone[]>;
  fetchZoneById: (id: string) => Promise<CongestionZone | null>;
}
