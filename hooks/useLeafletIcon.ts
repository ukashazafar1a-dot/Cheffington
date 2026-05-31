"use client";

import { useEffect, useState } from "react";

export function useLeafletIcon() {
  const [icon, setIcon] = useState<import("leaflet").Icon | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
        ._getIconUrl;

      setIcon(
        new L.Icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    });
  }, []);

  return icon;
}
