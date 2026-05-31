"use client";

import GeocodedMap from "@/components/GeocodedMap";
import type { AddressFields, GeocodePrecision } from "@/lib/geocode";
import { useState } from "react";

type RestaurantsMapProps = {
    address?: string;
    addressFields?: AddressFields;
    phone?: string;
    website?: string;
    lat?: number;
    lng?: number;
    geocodePrecision?: GeocodePrecision;
    locationName?: string;
};

const RestaurantsMap = ({
    address,
    addressFields,
    phone,
    website,
    lat,
    lng,
    geocodePrecision,
    locationName = "Chef Location",
}: RestaurantsMapProps) => {
    const displayAddress = address?.trim() || "Address not provided";
    const displayPhone = phone?.trim() || "Phone not provided";
    const displayWebsite = website?.trim();
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleGetDirections = () => {
        if (!address?.trim()) return;
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
    };

    const handlePhoneClick = () => {
        if (!phone?.trim()) return;
        window.open(`tel:${phone.replace(/[^0-9]/g, "")}`, "_blank");
    };

    const handleWebsiteClick = () => {
        if (!displayWebsite) return;
        const url = displayWebsite.startsWith("http")
            ? displayWebsite
            : `https://${displayWebsite}`;
        window.open(url, "_blank");
    };

    return (
        <div className="relative z-0 isolate overflow-hidden rounded-3xl bg-[#FF8400] [&_.leaflet-pane]:!z-[1] [&_.leaflet-top]:!z-[2] [&_.leaflet-container]:!z-0">
            {/* Map — keep Leaflet panes below navbar dropdowns */}
            <div className="relative z-0 md:h-111.75">
                <GeocodedMap
                    address={address?.trim() || undefined}
                    addressFields={addressFields}
                    lat={lat}
                    lng={lng}
                    geocodePrecision={geocodePrecision}
                    name={locationName}
                    className="w-full h-full min-h-60"
                    unavailableLabel={
                        address?.trim()
                            ? "Map unavailable for this address"
                            : "Add an address to see the map"
                    }
                />
            </div>

            {/* Address & Contact Info */}
            <div className="flex flex-col text-center">
                {/* Address Section */}
                <div className="px-6 py-5 border-b border-black/10 group relative">
                    <p className="font-extrabold text-sm text-black tracking-[-2%] leading-tight">
                        {displayAddress}
                    </p>
                    {address?.trim() ? (
                    <button
                        onClick={handleGetDirections}
                        className="text-[10px] font-black uppercase underline tracking-widest mt-1 hover:text-white transition-colors"
                    >
                        Get Directions
                    </button>
                    ) : null}
                    <button
                        onClick={() => address?.trim() && handleCopy(address, "address")}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy address"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    {copied === "address" && (
                        <span className="absolute text-xs text-green-600 bg-white px-2 py-1 rounded shadow-md">
                            Copied!
                        </span>
                    )}
                </div>

                {/* Phone Section */}
                <div className="px-6 py-4 border-b border-black/10 group relative">
                    <button
                        type="button"
                        onClick={handlePhoneClick}
                        disabled={!phone?.trim()}
                        className="font-extrabold tracking-[-2%] text-sm text-black hover:underline w-full disabled:cursor-default disabled:no-underline"
                    >
                        {displayPhone}
                    </button>
                    <button
                        onClick={() => phone?.trim() && handleCopy(phone, "phone")}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy phone number"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    {copied === "phone" && (
                        <span className="absolute text-xs text-green-600 bg-white px-2 py-1 rounded shadow-md">
                            Copied!
                        </span>
                    )}
                </div>

                {/* Website Section */}
                {displayWebsite ? (
                <div className="px-6 py-4 group relative">
                    <button
                        type="button"
                        onClick={handleWebsiteClick}
                        className="font-extrabold tracking-[-2%] text-sm text-black hover:underline w-full"
                    >
                        {displayWebsite}
                    </button>
                    <button
                        onClick={() => handleCopy(displayWebsite, "website")}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy website"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    {copied === "website" && (
                        <span className="absolute text-xs text-green-600 bg-white px-2 py-1 rounded shadow-md">
                            Copied!
                        </span>
                    )}
                </div>
                ) : null}
            </div>
        </div>
    );
};

export default RestaurantsMap;