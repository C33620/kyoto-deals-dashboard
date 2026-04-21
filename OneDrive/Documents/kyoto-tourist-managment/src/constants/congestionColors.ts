import type { CongestionLevel } from "@/types";

export const CONGESTION_LABELS: Record<CongestionLevel, string> = {
  1: "Comfortable",
  2: "Slightly Busy",
  3: "Moderate",
  4: "Busy",
  5: "Very Crowded",
};

export interface CongestionColors {
  fill: string;
  stroke: string;
  fillOpacity: number;
  tailwindBg: string;
  tailwindText: string;
}

export const CONGESTION_COLORS: Record<CongestionLevel, CongestionColors> = {
  1: {
    fill: "#22c55e",
    stroke: "#16a34a",
    fillOpacity: 0.3,
    tailwindBg: "bg-green-500",
    tailwindText: "text-green-700",
  },
  2: {
    fill: "#84cc16",
    stroke: "#65a30d",
    fillOpacity: 0.35,
    tailwindBg: "bg-lime-500",
    tailwindText: "text-lime-700",
  },
  3: {
    fill: "#eab308",
    stroke: "#ca8a04",
    fillOpacity: 0.35,
    tailwindBg: "bg-yellow-500",
    tailwindText: "text-yellow-700",
  },
  4: {
    fill: "#f97316",
    stroke: "#ea580c",
    fillOpacity: 0.4,
    tailwindBg: "bg-orange-500",
    tailwindText: "text-orange-700",
  },
  5: {
    fill: "#ef4444",
    stroke: "#dc2626",
    fillOpacity: 0.45,
    tailwindBg: "bg-red-500",
    tailwindText: "text-red-700",
  },
};
