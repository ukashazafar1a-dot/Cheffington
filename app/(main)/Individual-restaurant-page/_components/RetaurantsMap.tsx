"use client";

import Map from "@/components/Map";
import { useState } from "react";

type RestaurantsMapProps = {
    address?: string;
    phone?: string;
    website?: string;
    lat?: number;
    lng?: number;
    locationName?: string;
    /** Public detail: map + address only; phone/website live in sidebar */
    compact?: boolean;
};

const RestaurantsMap = ({
    address = "123 Fake Street, Austin, TX 12345",
    phone = "(555) 555-5555",
    website = "www.website.com",
    lat = 30.2672,
    lng = -97.7431,
    locationName = "Chef Location",
    compact = false,
}: RestaurantsMapProps) => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleGetDirections = () => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
    };

    const handlePhoneClick = () => {
        window.open(`tel:${phone.replace(/[^0-9]/g, "")}`, "_blank");
    };

    const handleWebsiteClick = () => {
        const url = website.startsWith("http") ? website : `https://${website}`;
        window.open(url, "_blank");
    };

    return (
        <div className="bg-[#FF8400] rounded-3xl overflow-hidden">
            {/* Map Placeholder for Sidebar */}
            <div className={compact ? "h-48 md:h-52" : "md:h-111.75"}>
                <Map lat={lat} lng={lng} name={locationName} />
            </div>

            {/* Address & Contact Info */}
            <div className="flex flex-col text-center">
                {/* Address Section */}
                <div
                    className={`group relative ${compact ? "px-5 py-4" : "px-6 py-5 border-b border-black/10"}`}
                >
                    <p className="font-extrabold text-sm text-black tracking-[-2%] leading-tight">
                        {address}
                    </p>
                    <button
                        onClick={handleGetDirections}
                        className="text-[10px] font-black uppercase underline tracking-widest mt-1 hover:text-white transition-colors"
                    >
                        Get Directions
                    </button>
                    <button
                        onClick={() => handleCopy(address, "address")}
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

                {!compact && (
                <>
                {/* Phone Section */}
                <div className="px-6 py-4 border-b border-black/10 group relative">
                    <button
                        onClick={handlePhoneClick}
                        className="font-extrabold tracking-[-2%] text-sm text-black hover:underline w-full"
                    >
                        {phone}
                    </button>
                    <button
                        onClick={() => handleCopy(phone, "phone")}
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
                <div className="px-6 py-4 group relative">
                    <button
                        onClick={handleWebsiteClick}
                        className="font-extrabold tracking-[-2%] text-sm text-black hover:underline w-full"
                    >
                        {website}
                    </button>
                    <button
                        onClick={() => handleCopy(website, "website")}
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
                </>
                )}
            </div>
        </div>
    );
};

export default RestaurantsMap;