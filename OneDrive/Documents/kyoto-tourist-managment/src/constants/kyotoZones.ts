import type { ZoneGeometry } from "@/types";

export type ZoneCategory =
  | "temple-shrine"
  | "nature-garden"
  | "market-shopping"
  | "district-culture"
  | "transport-hub";

export interface ZoneGeometryWithCategory extends ZoneGeometry {
  category: ZoneCategory;
  description: string;
  isHiddenGem: boolean;
  alternativeTo?: string[];
}

export const KYOTO_ZONES: ZoneGeometryWithCategory[] = [
  // ── TEMPLES & SHRINES ──────────────────────────────────────────
  {
    id: "gion-kiyomizudera",
    name: "Kiyomizudera",
    category: "temple-shrine",
    description: "Iconic hilltop temple with wooden stage overlooking Kyoto",
    center: { lat: 35.0035, lng: 135.7784 },
    radius: 700,
    isHiddenGem: false,
  },
  {
    id: "fushimi-inari",
    name: "Fushimi Inari",
    category: "temple-shrine",
    description: "Thousands of torii gates winding up Mount Inari",
    center: { lat: 34.9671, lng: 135.7727 },
    radius: 600,
    isHiddenGem: false,
  },
  {
    id: "kinkakuji",
    name: "Kinkakuji (Golden Pavilion)",
    category: "temple-shrine",
    description: "Gold-leaf covered Zen Buddhist temple on a reflecting pond",
    center: { lat: 35.0394, lng: 135.7292 },
    radius: 500,
    isHiddenGem: false,
  },
  {
    id: "ryoanji",
    name: "Ryoanji",
    category: "temple-shrine",
    description: "Famous Zen rock garden — quieter alternative to Kinkakuji",
    center: { lat: 35.0345, lng: 135.7185 },
    radius: 450,
    isHiddenGem: false,
    alternativeTo: ["kinkakuji"],
  },
  {
    id: "nijo-castle",
    name: "Nijo Castle",
    category: "temple-shrine",
    description: "17th-century shogun castle with nightingale floors",
    center: { lat: 35.0142, lng: 135.7481 },
    radius: 550,
    isHiddenGem: false,
  },
  {
    id: "tofukuji",
    name: "Tofukuji",
    category: "temple-shrine",
    description:
      "Zen temple famous for autumn maples — less visited than Kiyomizudera",
    center: { lat: 34.9778, lng: 135.7728 },
    radius: 480,
    isHiddenGem: false,
    alternativeTo: ["gion-kiyomizudera"],
  },
  {
    id: "daitokuji",
    name: "Daitokuji",
    category: "temple-shrine",
    description:
      "Large Zen complex with multiple sub-temples, rarely overcrowded",
    center: { lat: 35.0437, lng: 135.7445 },
    radius: 500,
    isHiddenGem: true,
    alternativeTo: ["kinkakuji", "gion-kiyomizudera"],
  },
  {
    id: "kurama-temple",
    name: "Kurama Temple",
    category: "temple-shrine",
    description:
      "Mountain temple north of Kyoto — peaceful forest hiking trails",
    center: { lat: 35.1133, lng: 135.7697 },
    radius: 500,
    isHiddenGem: true,
    alternativeTo: ["fushimi-inari"],
  },
  {
    id: "kamigamo-shrine",
    name: "Kamigamo Shrine",
    category: "temple-shrine",
    description: "UNESCO-listed shrine in a quiet northern neighborhood",
    center: { lat: 35.0591, lng: 135.7522 },
    radius: 450,
    isHiddenGem: true,
    alternativeTo: ["kinkakuji", "daitokuji"],
  },
  {
    id: "fushimi-momoyama-castle",
    name: "Fushimi Momoyama Castle Area",
    category: "temple-shrine",
    description: "Historic castle district — almost no tourist crowds",
    center: { lat: 34.937, lng: 135.7747 },
    radius: 500,
    isHiddenGem: true,
    alternativeTo: ["nijo-castle"],
  },
  {
    id: "jojakko-ji",
    name: "Jojakko-ji",
    category: "temple-shrine",
    description: "Tranquil moss-covered temple steps above Arashiyama",
    center: { lat: 35.0171, lng: 135.6704 },
    radius: 350,
    isHiddenGem: true,
    alternativeTo: ["arashiyama-sagano", "gion-kiyomizudera"],
  },
  {
    id: "nison-in",
    name: "Nison-in",
    category: "temple-shrine",
    description: "Hidden double-Buddha temple tucked in Sagano hills",
    center: { lat: 35.02, lng: 135.671 },
    radius: 300,
    isHiddenGem: true,
    alternativeTo: ["arashiyama-sagano"],
  },
  {
    id: "konkai-komyoji",
    name: "Kurodani / Konkai Komyoji",
    category: "temple-shrine",
    description: "Massive hilltop temple complex with panoramic city views",
    center: { lat: 35.0198, lng: 135.7878 },
    radius: 400,
    isHiddenGem: true,
    alternativeTo: ["gion-kiyomizudera", "higashiyama"],
  },

  // ── NATURE & GARDENS ───────────────────────────────────────────
  {
    id: "arashiyama-sagano",
    name: "Arashiyama / Sagano",
    category: "nature-garden",
    description: "Bamboo grove, river, and mountain scenery in west Kyoto",
    center: { lat: 35.0094, lng: 135.6727 },
    radius: 800,
    isHiddenGem: false,
  },
  {
    id: "philosopher-path",
    name: "Philosopher's Path",
    category: "nature-garden",
    description: "Canal-side walking path lined with cherry trees",
    center: { lat: 35.0271, lng: 135.7937 },
    radius: 500,
    isHiddenGem: false,
  },
  {
    id: "fushimi-momoyama",
    name: "Fushimi Sake District",
    category: "nature-garden",
    description: "Historic sake breweries with canals and weeping willows",
    center: { lat: 34.9465, lng: 135.7631 },
    radius: 600,
    isHiddenGem: true,
    alternativeTo: ["arashiyama-sagano"],
  },
  {
    id: "kibune-village",
    name: "Kibune Village",
    category: "nature-garden",
    description: "Riverside village in a cedar forest — summer kawadoko dining",
    center: { lat: 35.12, lng: 135.76 },
    radius: 450,
    isHiddenGem: true,
    alternativeTo: ["philosopher-path", "arashiyama-sagano"],
  },
  {
    id: "kyoto-imperial-park",
    name: "Kyoto Imperial Palace Park",
    category: "nature-garden",
    description:
      "Vast open park in the city center — locals only, no tour groups",
    center: { lat: 35.0254, lng: 135.762 },
    radius: 700,
    isHiddenGem: true,
    alternativeTo: ["central-kawaramachi", "arashiyama-sagano"],
  },
  {
    id: "katsura-imperial-villa",
    name: "Katsura Imperial Villa Area",
    category: "nature-garden",
    description:
      "World-class Japanese garden design — requires advance booking",
    center: { lat: 34.9876, lng: 135.7071 },
    radius: 400,
    isHiddenGem: true,
    alternativeTo: ["arashiyama-sagano", "ryoanji"],
  },

  // ── MARKETS & SHOPPING ─────────────────────────────────────────
  {
    id: "nishiki-market",
    name: "Nishiki Market Area",
    category: "market-shopping",
    description:
      "Kyoto's kitchen — narrow covered market with local food stalls",
    center: { lat: 35.0052, lng: 135.7648 },
    radius: 350,
    isHiddenGem: false,
  },
  {
    id: "teramachi-sanjo",
    name: "Teramachi / Sanjo",
    category: "market-shopping",
    description: "Antique shops, kissaten cafés and traditional crafts",
    center: { lat: 35.0089, lng: 135.7685 },
    radius: 400,
    isHiddenGem: false,
    alternativeTo: ["nishiki-market"],
  },
  {
    id: "pontocho",
    name: "Pontocho Alley",
    category: "market-shopping",
    description:
      "Narrow lantern-lit alley with izakayas — authentic local dining",
    center: { lat: 35.0072, lng: 135.7706 },
    radius: 300,
    isHiddenGem: true,
    alternativeTo: ["nishiki-market"],
  },
  {
    id: "toji-market",
    name: "Toji Temple Market",
    category: "market-shopping",
    description: "Monthly antique flea market at Toji — 21st of each month",
    center: { lat: 34.9808, lng: 135.7474 },
    radius: 400,
    isHiddenGem: true,
    alternativeTo: ["nishiki-market", "teramachi-sanjo"],
  },

  // ── DISTRICTS & CULTURE ────────────────────────────────────────
  {
    id: "central-kawaramachi",
    name: "Central District (Kawaramachi / Karasuma)",
    category: "district-culture",
    description: "Kyoto's main commercial and cultural downtown district",
    center: { lat: 35.0046, lng: 135.7681 },
    radius: 650,
    isHiddenGem: false,
  },
  {
    id: "higashiyama",
    name: "Higashiyama District",
    category: "district-culture",
    description: "Preserved historic streets with machiya townhouses",
    center: { lat: 35.0, lng: 135.78 },
    radius: 600,
    isHiddenGem: false,
  },
  {
    id: "nishiki-koji-backstreets",
    name: "Nishiki Koji Backstreets",
    category: "district-culture",
    description: "Local residential lanes behind the tourist corridors",
    center: { lat: 35.006, lng: 135.763 },
    radius: 350,
    isHiddenGem: true,
    alternativeTo: ["nishiki-market", "central-kawaramachi"],
  },
  {
    id: "fushimi-neighborhood",
    name: "Fushimi Local Neighborhood",
    category: "district-culture",
    description:
      "Working-class Kyoto district with sake culture and local life",
    center: { lat: 34.942, lng: 135.768 },
    radius: 500,
    isHiddenGem: true,
    alternativeTo: ["central-kawaramachi", "higashiyama"],
  },

  // ── TRANSPORT HUBS ─────────────────────────────────────────────
  {
    id: "kyoto-station",
    name: "Around Kyoto Station",
    category: "transport-hub",
    description: "Main transport hub — busy at all hours",
    center: { lat: 34.9858, lng: 135.7588 },
    radius: 550,
    isHiddenGem: false,
  },
];

// Helper: get quieter alternatives for a given zone
export function getAlternativeZones(
  zoneId: string,
  allZones: ZoneGeometryWithCategory[],
): ZoneGeometryWithCategory[] {
  // Zones that explicitly list this zone as alternativeTo
  const explicit = allZones.filter(
    (z) => z.alternativeTo?.includes(zoneId) && z.id !== zoneId,
  );
  if (explicit.length > 0) return explicit;

  // Fallback: same category, hidden gems
  const zone = allZones.find((z) => z.id === zoneId);
  if (!zone) return [];
  return allZones.filter(
    (z) => z.category === zone.category && z.id !== zoneId && z.isHiddenGem,
  );
}
