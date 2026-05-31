"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapMarker } from "@/lib/restaurant-location";

export function MapFitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;

    import("leaflet").then((L) => {
      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], 13);
        return;
      }

      const bounds = L.latLngBounds(
        markers.map((marker) => [marker.lat, marker.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    });
  }, [map, markers]);

  return null;
}
