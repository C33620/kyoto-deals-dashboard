/// <reference types="@types/google.maps" />
"use client";

import { CONGESTION_COLORS } from "@/constants/congestionColors";
import type { CongestionZone, ZoneGeometry } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef } from "react";

interface ZoneOverlayProps {
  geometry: ZoneGeometry;
  congestion: CongestionZone;
  isSelected: boolean;
  onClick: (zoneId: string) => void;
}

export function ZoneOverlay({
  geometry,
  congestion,
  isSelected,
  onClick,
}: ZoneOverlayProps) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);
  const colors = CONGESTION_COLORS[congestion.level];

  const handleClick = useCallback(() => {
    onClick(geometry.id);
  }, [onClick, geometry.id]);

  // Mount circle once when map is ready
  useEffect(() => {
    if (!map) return;

    circleRef.current = new google.maps.Circle({
      map,
      center: geometry.center,
      radius: geometry.radius,
      fillColor: colors.fill,
      fillOpacity: isSelected ? colors.fillOpacity + 0.15 : colors.fillOpacity,
      strokeColor: colors.stroke,
      strokeOpacity: isSelected ? 1 : 0.7,
      strokeWeight: isSelected ? 2.5 : 1.5,
      clickable: true,
      zIndex: isSelected ? 10 : 1,
    });

    const listener = circleRef.current.addListener("click", handleClick);

    return () => {
      google.maps.event.removeListener(listener);
      circleRef.current?.setMap(null);
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Update styles when selection or level changes without remounting
  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.setOptions({
      fillColor: colors.fill,
      fillOpacity: isSelected ? colors.fillOpacity + 0.15 : colors.fillOpacity,
      strokeColor: colors.stroke,
      strokeOpacity: isSelected ? 1 : 0.7,
      strokeWeight: isSelected ? 2.5 : 1.5,
      zIndex: isSelected ? 10 : 1,
    });
  }, [colors, isSelected]);

  return null;
}
