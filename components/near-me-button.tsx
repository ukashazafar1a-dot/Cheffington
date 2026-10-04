"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { setStoredVisitorGeo } from "@/lib/ad-target-radius";

export default function NearMeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isActive = searchParams.get("near") === "1";

  const handleNearMe = () => {
    if (isActive) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("near");
      params.delete("nearLat");
      params.delete("nearLng");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setStoredVisitorGeo(lat, lng);
        const params = new URLSearchParams(searchParams.toString());
        params.set("near", "1");
        params.set("nearLat", String(lat));
        params.set("nearLng", String(lng));
        router.push(`${pathname}?${params.toString()}`);
        setLoading(false);
      },
      () => {
        toast.error("Unable to access your location. Check browser permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Button
      title={isActive ? "Near me (on)" : "Near me"}
      onClick={handleNearMe}
      loading={loading}
    />
  );
}
