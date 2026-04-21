"use client";

import {
  CONGESTION_COLORS,
  CONGESTION_LABELS,
} from "@/constants/congestionColors";
import type { CongestionZone } from "@/types";
import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
export interface ShopMarker {
  id: number;
  lat: number;
  lon: number;
  name: string;
  type: string;
}

interface ZoneInfoCardProps {
  zone: CongestionZone;
  shops: ShopMarker[] | null;
  onDismiss: () => void;
}

// ─── Category config ────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  restaurant: { label: "Restaurants", emoji: "🍜" },
  cafe: { label: "Cafés", emoji: "☕" },
  bar: { label: "Bars", emoji: "🍺" },
  fast_food: { label: "Fast Food", emoji: "🍔" },
  convenience: { label: "Convenience", emoji: "🏪" },
  supermarket: { label: "Supermarkets", emoji: "🛒" },
  bakery: { label: "Bakeries", emoji: "🥐" },
  clothes: { label: "Clothing", emoji: "👗" },
  souvenir: { label: "Souvenirs", emoji: "🎁" },
  gift: { label: "Gifts", emoji: "🎁" },
  electronics: { label: "Electronics", emoji: "📱" },
  pharmacy: { label: "Pharmacies", emoji: "💊" },
};

function getCategoryConfig(type: string) {
  return (
    CATEGORY_CONFIG[type] ?? {
      label: capitalize(type.replace(/_/g, " ")),
      emoji: "🛍️",
    }
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function groupShops(shops: ShopMarker[]): [string, ShopMarker[]][] {
  const map = new Map<string, ShopMarker[]>();
  for (const shop of shops) {
    const key = shop.type;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(shop);
  }
  const knownOrder = Object.keys(CATEGORY_CONFIG);
  return [...map.entries()].sort(([a], [b]) => {
    const ai = knownOrder.indexOf(a);
    const bi = knownOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

function formatUpdatedAt(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

// ─── Component ─────────────────────────────────────────────────────────────
export function ZoneInfoCard({ zone, shops, onDismiss }: ZoneInfoCardProps) {
  const colors = CONGESTION_COLORS[zone.level];
  const label = CONGESTION_LABELS[zone.level];
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (type: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const grouped = shops ? groupShops(shops) : [];

  return (
    <div
      role="dialog"
      aria-label={`Congestion info for ${zone.name}`}
      className="w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl"
      style={{
        boxShadow: "var(--shadow-lg)",
        maxHeight: "calc(100vh - 6rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div className="p-4 pb-3 shrink-0">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)] leading-snug">
            {zone.name}
          </h2>
          <button
            onClick={onDismiss}
            aria-label="Close info card"
            className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-0.5 rounded"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Level badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.tailwindBg}`}
            aria-hidden="true"
          />
          <span className={`text-sm font-medium ${colors.tailwindText}`}>
            {label}
          </span>
          <span className="ml-auto text-xs text-[var(--color-text-faint)] tabular-nums font-medium">
            Level {zone.level}/5
          </span>
        </div>

        {/* Congestion bar — uses fill hex directly, no Tailwind purge risk */}
        <div
          className="w-full h-2 rounded-full bg-[var(--color-surface-offset)] overflow-hidden mb-3"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(zone.level / 5) * 100}%`,
              backgroundColor: colors.fill,
            }}
          />
        </div>

        {/* Timestamp */}
        <p className="text-xs text-[var(--color-text-muted)]">
          Last updated{" "}
          <time dateTime={zone.updatedAt} className="tabular-nums">
            {formatUpdatedAt(zone.updatedAt)}
          </time>
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[var(--color-divider)] mx-4 shrink-0" />

      {/* ── Shops section ── */}
      <div className="flex flex-col min-h-0 overflow-y-auto p-4 pt-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 shrink-0">
          Nearby places
        </p>

        {/* Loading */}
        {shops === null && (
          <div className="flex items-center gap-2 py-3 text-xs text-[var(--color-text-muted)]">
            <svg
              className="animate-spin w-3.5 h-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Loading places…
          </div>
        )}

        {/* Empty */}
        {shops !== null && shops.length === 0 && (
          <p className="text-xs text-[var(--color-text-muted)] py-3 text-center">
            No places found in this area
          </p>
        )}

        {/* Grouped categories */}
        {shops !== null && grouped.length > 0 && (
          <div className="flex flex-col gap-1">
            {grouped.map(([type, items]) => {
              const config = getCategoryConfig(type);
              const isOpen = openCategories.has(type);

              return (
                <div
                  key={type}
                  className="rounded-lg overflow-hidden border border-[var(--color-border)]"
                >
                  <button
                    onClick={() => toggleCategory(type)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-offset)] hover:bg-[var(--color-surface-dynamic)] transition-colors text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm shrink-0" aria-hidden="true">
                      {config.emoji}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text)] flex-1">
                      {config.label}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] tabular-nums mr-1">
                      {items.length}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 200ms ease",
                        color: "var(--color-text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <ul
                      role="list"
                      className="divide-y divide-[var(--color-divider)]"
                    >
                      {items.map((shop) => (
                        <li key={shop.id}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 px-3 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)] transition-colors group"
                          >
                            <p className="text-xs font-medium text-[var(--color-text)] truncate">
                              {shop.name}
                            </p>
                            {/* External link icon */}
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                              className="shrink-0 text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)] transition-colors"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
