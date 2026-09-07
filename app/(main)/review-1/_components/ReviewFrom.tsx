"use client";

import Button from "@/components/Button";
import {
  REVIEW_IMAGE_MAX_BYTES,
  REVIEW_MEDIA_ACCEPTED_TYPES,
  REVIEW_MEDIA_MAX_FILES,
  REVIEW_VIDEO_MAX_BYTES,
  submitReview,
  uploadReviewMedia,
} from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ReviewFromProps = {
  restaurantId: string;
  restaurantName?: string;
};

type PendingMedia = {
  id: string;
  fileName: string;
  type: "image" | "video";
  mimeType?: string;
  previewUrl: string;
  url: string;
};

function isAcceptedMedia(file: File) {
  return (REVIEW_MEDIA_ACCEPTED_TYPES as readonly string[]).includes(file.type);
}

function mediaTypeForFile(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

function maxBytesForFile(file: File) {
  return mediaTypeForFile(file) === "video"
    ? REVIEW_VIDEO_MAX_BYTES
    : REVIEW_IMAGE_MAX_BYTES;
}

const ReviewFrom = ({ restaurantId, restaurantName }: ReviewFromProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [mediaTouched, setMediaTouched] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOwner(
      window.localStorage.getItem("chefApplicationType") === "business_owner"
    );
  }, []);

  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
    // Only revoke on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = async (fileList: FileList | File[]) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("chefToken")
        : null;

    if (!token) {
      router.push(
        `/sign-in?returnUrl=${encodeURIComponent(`/review-1?restaurantId=${restaurantId}`)}`
      );
      return;
    }

    const files = Array.from(fileList);
    if (!files.length) return;

    setError("");
    const remaining = REVIEW_MEDIA_MAX_FILES - media.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${REVIEW_MEDIA_MAX_FILES} files.`);
      return;
    }

    const selected = files.slice(0, remaining);
    setUploading(true);

    try {
      const uploaded: PendingMedia[] = [];
      for (const file of selected) {
        if (!isAcceptedMedia(file)) {
          throw new Error(
            "Unsupported file. Use JPEG, PNG, WebP, MP4, WebM, or MOV."
          );
        }
        if (file.size > maxBytesForFile(file)) {
          const maxMb = Math.floor(maxBytesForFile(file) / (1024 * 1024));
          throw new Error(
            `${file.name} is too large. Max ${maxMb} MB for ${mediaTypeForFile(file)}s.`
          );
        }

        const result = await uploadReviewMedia(file, restaurantId, token);
        uploaded.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          type: result.type,
          mimeType: result.mimeType || file.type,
          previewUrl: result.displayUrl || URL.createObjectURL(file),
          url: result.url,
        });
      }

      setMedia((prev) => [...prev, ...uploaded].slice(0, REVIEW_MEDIA_MAX_FILES));
      setMediaTouched(true);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload media"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMedia = (id: string) => {
    setMediaTouched(true);
    setMedia((prev) => {
      const next = prev.filter((item) => item.id !== id);
      const removed = prev.find((item) => item.id === id);
      if (removed?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError("");

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("chefToken")
        : null;

    if (!token) {
      router.push(
        `/sign-in?returnUrl=${encodeURIComponent(`/review-1?restaurantId=${restaurantId}`)}`
      );
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review.");
      return;
    }

    if (uploading) {
      setError("Please wait for uploads to finish.");
      return;
    }

    setLoading(true);
    try {
      const result = await submitReview(
        {
          restaurantId,
          comment: comment.trim(),
          title: title.trim() || undefined,
          // Only send media when the user added/removed files so a text-only
          // re-submit does not wipe attachments on an existing review upsert.
          ...(mediaTouched
            ? {
                media: media.map((item) => ({
                  url: item.url,
                  type: item.type,
                  mimeType: item.mimeType,
                  originalName: item.fileName,
                })),
              }
            : {}),
        },
        token
      );

      if (result.flagged) {
        router.push("/review-flagged");
        return;
      }

      router.push(`/restaurants/${restaurantId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card md:px-7 md:py-20">
      {restaurantName ? (
        <p className="mb-4 text-sm font-medium text-gray-700">
          Reviewing: <span className="font-bold text-gray-900">{restaurantName}</span>
        </p>
      ) : null}

      <h2 className="mb-2 text-2xl font-bold tracking-[-8%] sm:text-3xl md:text-4xl">
        {isOwner ? "Share your notes..." : "Share your Chef's Notes..."}
      </h2>
      <p className="mb-4 text-[18px] tracking-[-8%] md:text-[20px]">
        Don&apos;t forget to tell us about...
      </p>

      <div className="mb-4.5 flex flex-wrap gap-2 max-md:flex-wrap">
        {["your favorite dishes", "the experience", "the ambiance"].map((tag) => (
          <span
            key={tag}
            className="rounded-[6px] bg-black px-3 py-3 text-center text-[14px] font-medium text-[#FFF1E1] sm:text-[16px] md:basis-1/3 md:text-[20px]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title (optional)"
          className="input-field mb-4"
          maxLength={120}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Positive reviews only. Negative reviews will be removed and your account will be flagged."
          className="input-field h-44 md:h-96"
        />
        <p className="mt-1 text-xs text-gray-500">{comment.trim().length} characters</p>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-gray-900">
          Upload images or video (optional)
        </p>
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files?.length) {
              void addFiles(e.dataTransfer.files);
            }
          }}
          className={`rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragActive
              ? "border-[#FF8400] bg-[#FFF1E1]"
              : "border-black/30 bg-white"
          }`}
        >
          <p className="text-sm text-gray-700 md:text-base">
            Drag &amp; Drop Files,{" "}
            <button
              type="button"
              className="font-semibold text-[#FF8400] underline underline-offset-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
            >
              Choose Files to Upload
            </button>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Up to {REVIEW_MEDIA_MAX_FILES} files. Images max 5 MB (JPEG/PNG/WebP).
            Videos max 50 MB (MP4/WebM/MOV).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={REVIEW_MEDIA_ACCEPTED_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                void addFiles(e.target.files);
              }
            }}
          />
        </div>

        {media.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((item) => (
              <li
                key={item.id}
                className="relative overflow-hidden rounded-lg border border-black/10 bg-black/5"
              >
                {item.type === "video" ? (
                  <video
                    src={item.previewUrl}
                    className="h-28 w-full object-cover"
                    controls
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={item.fileName}
                    className="h-28 w-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white"
                >
                  Remove
                </button>
                <p className="truncate px-2 py-1 text-[11px] text-gray-600">
                  {item.fileName}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {uploading ? (
          <p className="mt-2 text-sm text-gray-600">Uploading media…</p>
        ) : null}
      </div>

      {error ? <p className="form-error mb-4">{error}</p> : null}

      <div className="relative mt-10 flex justify-center">
        <Button
          title="Share"
          onClick={handleSubmit}
          loading={loading || uploading}
          disabled={loading || uploading}
        />
      </div>
    </div>
  );
};

export default ReviewFrom;
