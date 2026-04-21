"use client";

import type { ShopMarker } from "@/components/map/ZoneInfoCard";
import {
  CONGESTION_COLORS,
  CONGESTION_LABELS,
} from "@/constants/congestionColors";
import { KYOTO_ZONES } from "@/constants/kyotoZones";
import type { CongestionZone } from "@/types";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, TileLayer, Tooltip } from "react-leaflet";

const KYOTO_CENTER: [number, number] = [35.0116, 135.7681];
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "";

interface KyotoMapInnerProps {
  congestionData: Map<string, CongestionZone>;
  selectedZoneId: string | null;
  shopsByZone: Map<string, ShopMarker[] | null>;
  onZoneClick: (id: string) => void;
  onDismiss: () => void;
}

export default function KyotoMapInner({
  congestionData,
  selectedZoneId,
  onZoneClick,
}: KyotoMapInnerProps) {
  return (
    <MapContainer
      center={KYOTO_CENTER}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        tileSize={512}
        zoomOffset={-1}
      />

      {/* ── Congestion circles ── */}
      {KYOTO_ZONES.map((zone) => {
        const data = congestionData.get(zone.id);
        if (!data) return null;
        const colors = CONGESTION_COLORS[data.level];
        const isSelected = selectedZoneId === zone.id;

        return (
          <Circle
            key={zone.id}
            center={[zone.center.lat, zone.center.lng]}
            radius={zone.radius}
            pathOptions={{
              fillColor: colors.fill,
              fillOpacity: isSelected
                ? colors.fillOpacity + 0.15
                : colors.fillOpacity,
              color: colors.stroke,
              opacity: isSelected ? 1 : 0.7,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onZoneClick(zone.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent={false}>
              <div style={{ minWidth: 120 }}>
                <span className="font-medium">{zone.name}</span>
                <br />
                {CONGESTION_LABELS[data.level]}
              </div>
            </Tooltip>
          </Circle>
        );
      })}
    </MapContainer>
  );
}
