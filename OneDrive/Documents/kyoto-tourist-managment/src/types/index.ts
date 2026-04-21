export type CongestionLevel = 1 | 2 | 3 | 4 | 5;

export type ZoneCategory =
  | "temple-shrine"
  | "nature-garden"
  | "market-shopping"
  | "district-culture"
  | "transport-hub";

export interface CongestionZone {
  id: string;
  name: string;
  level: CongestionLevel;
  updatedAt: string;
  category?: ZoneCategory;
  description?: string;
}

export interface ZoneGeometry {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
}
