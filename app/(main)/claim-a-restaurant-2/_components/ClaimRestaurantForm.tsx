"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import {
  CLAIM_ATTACHMENT_ACCEPTED_TYPES,
  CLAIM_ATTACHMENT_MAX_BYTES,
  submitRestaurantClaim,
  uploadRestaurantClaimAttachment,
} from "@/lib/api-client";

const ClaimRestaurantForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") ?? "";
  const restaurantName = searchParams.get("restaurantName") ?? "";

  const [form, setForm] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantPhone: "",
    relationshipToBusiness: "owner" as
      | "owner"
      | "manager"
      | "authorized_representative"
      | "other",
    jobTitle: "",
    proofSummary: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedAttachments, setUploadedAttachments] = useState<
    { publicUrl: string; displayUrl?: string; name: string }[]
  >([]);

  const isValid = useMemo(() => {
    return Boolean(
      restaurantId &&
        form.claimantName.trim() &&
        form.claimantEmail.trim() &&
        form.claimantPhone.trim() &&
        form.relationshipToBusiness &&
        form.proofSummary.trim()
    );
  }, [form, restaurantId]);

  const onSelectAttachments = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (!form.claimantName.trim()) {
      setError("Please enter full name before uploading attachments");
      return;
    }
    if (!restaurantId) {
      setError("Restaurant is missing. Please go back and select restaurant again.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploads: { publicUrl: string; displayUrl?: string; name: string }[] =
        [];
      for (const file of files) {
        if (!CLAIM_ATTACHMENT_ACCEPTED_TYPES.includes(file.type as (typeof CLAIM_ATTACHMENT_ACCEPTED_TYPES)[number])) {
          throw new Error(
            `${file.name}: Invalid file type. Use PDF, JPEG, PNG, or WebP`
          );
        }
        if (file.size > CLAIM_ATTACHMENT_MAX_BYTES) {
          throw new Error(
            `${file.name}: File is too large (max ${Math.floor(
              CLAIM_ATTACHMENT_MAX_BYTES / (1024 * 1024)
            )} MB)`
          );
        }

        const res = await uploadRestaurantClaimAttachment(
          file,
          form.claimantName.trim(),
          restaurantId
        );
        uploads.push({
          publicUrl: res.publicUrl,
          displayUrl: res.displayUrl,
          name: file.name,
        });
      }

      setUploadedAttachments((prev) => [...prev, ...uploads]);
      e.target.value = "";
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload attachment"
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await submitRestaurantClaim({
        restaurantId,
        claimantName: form.claimantName.trim(),
        claimantEmail: form.claimantEmail.trim(),
        claimantPhone: form.claimantPhone.trim(),
        relationshipToBusiness: form.relationshipToBusiness,
        jobTitle: form.jobTitle.trim() || undefined,
        proofSummary: form.proofSummary.trim(),
        proofDocumentUrls: uploadedAttachments.map((f) => f.publicUrl),
      });

      const claimId = response.data?._id;
      const qs = new URLSearchParams();
      if (claimId) qs.set("claimId", claimId);
      if (restaurantName) qs.set("restaurantName", restaurantName);
      router.push(`/claim-a-restaurant-3${qs.toString() ? `?${qs}` : ""}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit claim"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-width-narrow max-sm:px-0!">
      <form onSubmit={onSubmit}>
        {restaurantName ? (
          <p className="mb-5 text-lg">
            Claiming: <span className="font-semibold">{restaurantName}</span>
          </p>
        ) : null}

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">Full Name</label>
          <input
            required
            type="text"
            value={form.claimantName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, claimantName: e.target.value }))
            }
            className="input-field border! border-black bg-[#EFEFEF]"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">Email</label>
          <input
            required
            type="email"
            value={form.claimantEmail}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, claimantEmail: e.target.value }))
            }
            className="input-field border! border-black bg-[#EFEFEF]"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">Phone</label>
          <input
            required
            type="text"
            value={form.claimantPhone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, claimantPhone: e.target.value }))
            }
            className="input-field border! border-black bg-[#EFEFEF]"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">
            Relationship to Business
          </label>
          <select
            value={form.relationshipToBusiness}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                relationshipToBusiness: e.target.value as
                  | "owner"
                  | "manager"
                  | "authorized_representative"
                  | "other",
              }))
            }
            className="input-field border! border-black bg-[#EFEFEF]"
          >
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="authorized_representative">
              Authorized Representative
            </option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">
            Job Title (optional)
          </label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            className="input-field border! border-black bg-[#EFEFEF]"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">
            Ownership Proof Summary
          </label>
          <textarea
            required
            value={form.proofSummary}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, proofSummary: e.target.value }))
            }
            className="input-field min-h-32 border! border-black bg-[#EFEFEF]"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-2 block text-lg font-medium!">
            Upload Proof Documents / Pictures (optional)
          </label>
          <input
            type="file"
            multiple
            accept={CLAIM_ATTACHMENT_ACCEPTED_TYPES.join(",")}
            onChange={onSelectAttachments}
            disabled={uploading || submitting}
            className="input-field border! border-black bg-[#EFEFEF]"
          />
          <p className="mt-2 text-xs text-neutral-700">
            Allowed: PDF, JPG, PNG, WebP. Max{" "}
            {Math.floor(CLAIM_ATTACHMENT_MAX_BYTES / (1024 * 1024))} MB each.
          </p>

          {uploading ? (
            <p className="mt-2 text-sm text-[#FF8400]">Uploading attachments...</p>
          ) : null}

          {uploadedAttachments.length ? (
            <ul className="mt-3 space-y-1 text-sm">
              {uploadedAttachments.map((file, idx) => (
                <li key={`${file.publicUrl}-${idx}`} className="flex items-center justify-between gap-3">
                  <a
                    href={file.displayUrl || file.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {file.name}
                  </a>
                  <button
                    type="button"
                    className="text-red-600 underline"
                    onClick={() =>
                      setUploadedAttachments((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        <Button
          className="w-full!"
          title={submitting ? "Submitting..." : "Send"}
          type="submit"
          disabled={!isValid || submitting}
        />
      </form>
    </div>
  );
};

export default ClaimRestaurantForm;
