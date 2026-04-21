import { KYOTO_ZONES } from "@/constants/kyotoZones";
import { NextResponse } from "next/server";

const BESTTIME_API_KEY = process.env.BESTTIME_API_KEY ?? "";

const BESTTIME_OVERRIDES: Record<string, { name: string; address: string }> = {
  "gion-kiyomizudera": {
    name: "Kiyomizu-dera",
    address: "1 Chome-294 Kiyomizu, Higashiyama Ward, Kyoto, Japan",
  },
  "fushimi-inari": {
    name: "Fushimi Inari Taisha",
    address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, Japan",
  },
  kinkakuji: {
    name: "Kinkaku-ji",
    address: "1 Kinkakujicho, Kita Ward, Kyoto, Japan",
  },
  ryoanji: {
    name: "Ryoan-ji",
    address: "13 Ryoanjigoryo-shitacho, Ukyo Ward, Kyoto, Japan",
  },
  "nijo-castle": {
    name: "Nijo Castle",
    address: "541 Nijojo-cho, Nakagyo Ward, Kyoto, Japan",
  },
  tofukuji: {
    name: "Tofuku-ji",
    address: "15-778 Honmachi, Higashiyama Ward, Kyoto, Japan",
  },
  daitokuji: {
    name: "Daitoku-ji",
    address: "53 Daitokujicho, Kita Ward, Kyoto, Japan",
  },
  "kurama-temple": {
    name: "Kurama-dera",
    address: "1074 Kuramahonmachi, Sakyo Ward, Kyoto, Japan",
  },
  "kamigamo-shrine": {
    name: "Kamigamo Shrine",
    address: "339 Kamigamo Motoyama, Kita Ward, Kyoto, Japan",
  },
  "fushimi-momoyama-castle": {
    name: "Fushimi Momoyama Castle",
    address: "Fushimi Momoyama, Fushimi Ward, Kyoto, Japan",
  },
  "jojakko-ji": {
    name: "Jojakko-ji Temple",
    address: "Sagaogurayama Oguracho, Ukyo Ward, Kyoto, Japan",
  },
  "nison-in": {
    name: "Nison-in Temple",
    address: "Saganisonin Monzen Nakanosachiocho, Ukyo Ward, Kyoto, Japan",
  },
  "konkai-komyoji": {
    name: "Konkai Komyo-ji",
    address: "121 Kurodanicho, Sakyo Ward, Kyoto, Japan",
  },
  "arashiyama-sagano": {
    name: "Arashiyama Bamboo Forest",
    address: "Sagaogurayama Tabuchiyamacho, Ukyo Ward, Kyoto, Japan",
  },
  "philosopher-path": {
    name: "Nanzen-ji",
    address: "86 Fukuchicho, Sakyo Ward, Kyoto, Japan",
  },
  "fushimi-momoyama": {
    name: "Gekkeikan Okura Sake Museum",
    address: "247 Minamihama-cho, Fushimi Ward, Kyoto, Japan",
  },
  "kibune-village": {
    name: "Kibune Shrine",
    address: "180 Kuramakibunecho, Sakyo Ward, Kyoto, Japan",
  },
  "kyoto-imperial-park": {
    name: "Kyoto Imperial Palace",
    address: "Kyoto Imperial Palace, Kamigyo Ward, Kyoto, Japan",
  },
  "katsura-imperial-villa": {
    name: "Katsura Imperial Villa",
    address: "Katsuramisono, Nishikyo Ward, Kyoto, Japan",
  },
  "nishiki-market": {
    name: "Nishiki Tenmangu Shrine",
    address: "Nishiki Tenmangu, Nakagyo Ward, Kyoto, Japan",
  },
  "teramachi-sanjo": {
    name: "Teramachi Shopping Street Kyoto",
    address: "Teramachi, Nakagyo Ward, Kyoto, Japan",
  },
  pontocho: {
    name: "Pontocho Alley",
    address: "Pontocho, Nakagyo Ward, Kyoto, Japan",
  },
  "toji-market": {
    name: "To-ji Temple",
    address: "1 Toji-cho, Minami Ward, Kyoto, Japan",
  },
  "central-kawaramachi": {
    name: "Gion Corner",
    address: "570-2 Minamigawa, Higashiyama Ward, Kyoto, Japan",
  },
  higashiyama: {
    name: "Yasaka Shrine Kyoto",
    address: "625 Gionmachi Kitagawa, Higashiyama Ward, Kyoto, Japan",
  },
  "nishiki-koji-backstreets": {
    name: "Nishiki Koji Kyoto",
    address: "Nishikikoji, Nakagyo Ward, Kyoto, Japan",
  },
  "fushimi-neighborhood": {
    name: "Fushimi Inari Station Area",
    address: "Fukakusa Ichi no Tsubo, Fushimi Ward, Kyoto, Japan",
  },
  "kyoto-station": {
    name: "Kyoto Station",
    address: "Karasuma-dori Shiokoji, Shimogyo Ward, Kyoto, Japan",
  },
};

function scoreToCongestionLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score < 20) return 1;
  if (score < 40) return 2;
  if (score < 60) return 3;
  if (score < 80) return 4;
  return 5;
}

function smartFallback(zoneId: string): 1 | 2 | 3 | 4 | 5 {
  const jstHour = (new Date().getUTCHours() + 9) % 24;
  const isWeekend = [0, 6].includes(new Date().getDay());
  const isPeak = jstHour >= 10 && jstHour <= 16;
  const hotZones = [
    "gion-kiyomizudera",
    "fushimi-inari",
    "arashiyama-sagano",
    "kinkakuji",
    "higashiyama",
  ];
  const isHot = hotZones.includes(zoneId);
  if (isPeak && isWeekend && isHot) return 5;
  if (isPeak && isHot) return 4;
  if (isPeak && isWeekend) return 3;
  if (isPeak) return 3;
  return 2;
}

async function fetchVenueCongestion(zone: (typeof KYOTO_ZONES)[0]) {
  const override = BESTTIME_OVERRIDES[zone.id];
  const venueName = override?.name ?? zone.name;
  const venueAddress = override?.address ?? `${zone.name}, Kyoto, Japan`;

  try {
    const forecastUrl = new URL("https://besttime.app/api/v1/forecasts");
    forecastUrl.searchParams.set("api_key_private", BESTTIME_API_KEY);
    forecastUrl.searchParams.set("venue_name", venueName);
    forecastUrl.searchParams.set("venue_address", venueAddress);

    const forecastRes = await fetch(forecastUrl.toString(), { method: "POST" });
    const forecastData = await forecastRes.json();

    if (!forecastRes.ok || forecastData.status === "Error") {
      throw new Error(JSON.stringify(forecastData.message));
    }

    const venueId: string = forecastData?.venue_info?.venue_id ?? "";
    if (!venueId) throw new Error("no venue_id");

    const liveUrl = new URL("https://besttime.app/api/v1/forecasts/live");
    liveUrl.searchParams.set("api_key_private", BESTTIME_API_KEY);
    liveUrl.searchParams.set("venue_id", venueId);

    const liveRes = await fetch(liveUrl.toString(), { method: "POST" });
    const liveData = await liveRes.json();
    const liveScore: number = liveData?.analysis?.venue_live_busyness;

    if (typeof liveScore === "number" && liveScore >= 0) {
      const level = scoreToCongestionLevel(liveScore);
      console.log(`[BestTime] ✅ ${zone.id} live=${liveScore} → L${level}`);
      return {
        id: zone.id,
        name: zone.name,
        category: zone.category,
        description: zone.description,
        isHiddenGem: zone.isHiddenGem,
        alternativeTo: zone.alternativeTo,
        level,
        updatedAt: new Date().toISOString(),
      };
    }

    // Fallback to forecast for current JST hour
    const jstHour = (new Date().getUTCHours() + 9) % 24;
    const dayAnalysis = forecastData?.analysis?.[0]?.hour_analysis;
    const hourData = Array.isArray(dayAnalysis)
      ? dayAnalysis.find((h: { hour: number }) => h.hour === jstHour)
      : null;
    const forecastScore = (hourData?.intensity_nr ?? 2) * 20;
    const level = scoreToCongestionLevel(forecastScore);
    console.log(`[BestTime] ⚠️ ${zone.id} forecast h=${jstHour} → L${level}`);

    return {
      id: zone.id,
      name: zone.name,
      category: zone.category,
      description: zone.description,
      isHiddenGem: zone.isHiddenGem,
      alternativeTo: zone.alternativeTo,
      level,
      updatedAt: new Date().toISOString(),
    };
  } catch (_err) {
    // ← fixed: was catch (err), err was unused
    const level = smartFallback(zone.id);
    console.error(`[BestTime] ❌ ${zone.id} → smart fallback L${level}`);
    return {
      id: zone.id,
      name: zone.name,
      category: zone.category,
      description: zone.description,
      isHiddenGem: zone.isHiddenGem,
      alternativeTo: zone.alternativeTo,
      level,
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function GET() {
  if (!BESTTIME_API_KEY) {
    return NextResponse.json(
      { error: "BESTTIME_API_KEY is not set" },
      { status: 500 },
    );
  }

  const results = await Promise.all(KYOTO_ZONES.map(fetchVenueCongestion));
  console.log(
    "[BestTime] Done:",
    results.map((r) => `${r.id}=L${r.level}`).join(", "),
  );

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
