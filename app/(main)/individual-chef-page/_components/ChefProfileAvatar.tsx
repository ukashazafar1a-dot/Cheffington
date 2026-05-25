"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadChefProfilePhoto } from "@/lib/api-client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  profilePhotoUrl?: string;
  chefName: string;
  editable?: boolean;
  onPhotoUpdated?: (displayUrl: string) => void;
};

export default function ChefProfileAvatar({
  profilePhotoUrl,
  chefName,
  editable = false,
  onPhotoUpdated,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(profilePhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setPhotoUrl(profilePhotoUrl);
  }, [profilePhotoUrl]);

  const displayUrl = photoUrl ?? profilePhotoUrl;
  const initials = chefName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError("Use JPEG, PNG, or WebP.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setUploadError("Image must be 5 MB or smaller.");
      return;
    }

    const token = window.localStorage.getItem("chefToken");
    if (!token) {
      setUploadError("Please sign in again.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadChefProfilePhoto(token, file);
      const newUrl = result.data?.profilePhotoUrl;
      if (newUrl) {
        setPhotoUrl(newUrl);
        onPhotoUpdated?.(newUrl);
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const circleClass =
    "md:w-26 md:h-26 w-16 h-17 rounded-full bg-[#FFF1E1] border-4 border-[#FFF1E1] flex items-center justify-center overflow-hidden shrink-0";

  const avatarContent = displayUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displayUrl}
      alt={`${chefName} profile`}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-lg font-bold text-[#FF8400] md:text-2xl">
      {initials || "?"}
    </span>
  );

  if (!editable) {
    return <div className={circleClass}>{avatarContent}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
        className={`group relative ${circleClass} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8400] disabled:cursor-wait`}
        aria-label="Upload profile photo"
      >
        {avatarContent}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleFileChange}
      />
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#FFF1E1]/80">
        {displayUrl ? "Change photo" : "Add photo"}
      </p>
      {uploadError ? (
        <p className="max-w-32 text-center text-[10px] text-red-300">{uploadError}</p>
      ) : null}
    </div>
  );
}
