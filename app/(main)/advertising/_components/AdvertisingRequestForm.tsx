"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import {
  ADVERTISING_ASSET_ACCEPTED_TYPES,
  ADVERTISING_ASSET_MAX_BYTES,
  getAdPlacements,
  submitAdRequest,
  uploadAdvertisingAsset,
} from "@/lib/api-client";
import type { AdPlacement, AdPricingPayload, AdPricingRow } from "@/types/advertising";
import { MAX_AD_DAYS, MIN_AD_DAYS } from "@/types/advertising";

const sectionTitle = "title text-center text-4xl md:text-5xl";
const sectionSubtitle = "subtitle mx-auto mt-3 max-w-2xl text-center text-xl md:text-2xl";

function getPricePerDay(
  placement: AdPlacement | undefined,
  row: AdPricingRow | undefined
): number {
  const fromPlacement = Number(placement?.pricePerDay);
  if (Number.isFinite(fromPlacement) && fromPlacement > 0) return fromPlacement;

  const fromRow = Number(row?.pricePerDay);
  if (Number.isFinite(fromRow) && fromRow > 0) return fromRow;

  const label = placement?.priceLabel || "";
  const perDayMatch = label.match(/\$?\s*([\d.]+)\s*\/?\s*day/i);
  if (perDayMatch) return Number(perDayMatch[1]) || 0;

  return 0;
}

function estimatePrice(
  placement: AdPlacement | undefined,
  row: AdPricingRow | undefined,
  days: number
): number | null {
  if (!placement) return null;
  const dayCount = Number(days);
  if (!Number.isFinite(dayCount) || dayCount < MIN_AD_DAYS) return null;

  const pricePerDay = getPricePerDay(placement, row);
  return Math.round(pricePerDay * dayCount * 100) / 100;
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function createInitialFormState() {
  return {
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    placementKey: "",
    days: "",
    needsDesign: false,
    message: "",
  };
}

export default function AdvertisingRequestForm() {
  const [pricing, setPricing] = useState<AdPricingPayload>({
    columns: [],
    rows: [],
    placements: [],
  });
  const [loadingPlacements, setLoadingPlacements] = useState(true);
  const [form, setForm] = useState(createInitialFormState);
  const [formKey, setFormKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adImagePreview, setAdImagePreview] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getAdPlacements()
      .then((data) => {
        setPricing(data);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load pricing"
        );
      })
      .finally(() => setLoadingPlacements(false));
  }, []);

  const placements = pricing.placements;
  const sortedColumns = [...pricing.columns].sort((a, b) => a.order - b.order);
  const sortedRows = [...pricing.rows].sort((a, b) => a.order - b.order);

  const resetFormState = () => {
    setForm(createInitialFormState());
    setAdImageUrl("");
    setAdImagePreview("");
    setUploadedFileName("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormKey((key) => key + 1);
  };

  const startAnotherRequest = () => {
    setSuccess("");
    resetFormState();
  };

  const priceColumnId =
    sortedColumns.find((column) => /price/i.test(column.label))?.id ||
    sortedColumns[sortedColumns.length - 1]?.id;

  const selectedPlacement = placements.find((p) => p.key === form.placementKey);
  const selectedRow = sortedRows.find((row) => row.slotKey === form.placementKey);
  const dayCount = Number(form.days);
  const hasValidDays =
    form.days !== "" &&
    Number.isInteger(dayCount) &&
    dayCount >= MIN_AD_DAYS &&
    dayCount <= MAX_AD_DAYS;
  const pricePerDay = getPricePerDay(selectedPlacement, selectedRow);
  const estimatedTotal =
    selectedPlacement && hasValidDays
      ? estimatePrice(selectedPlacement, selectedRow, dayCount)
      : null;

  const isValid = useMemo(() => {
    return Boolean(
      form.businessName.trim() &&
        form.contactName.trim() &&
        form.contactEmail.trim() &&
        form.contactPhone.trim() &&
        form.websiteUrl.trim() &&
        form.placementKey &&
        hasValidDays &&
        (form.needsDesign || adImageUrl)
    );
  }, [form, adImageUrl, hasValidDays]);

  const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!form.businessName.trim()) {
      setError("Please enter your business name before uploading an image");
      return;
    }

    if (
      !ADVERTISING_ASSET_ACCEPTED_TYPES.includes(
        file.type as (typeof ADVERTISING_ASSET_ACCEPTED_TYPES)[number]
      )
    ) {
      setError("Invalid file type. Use JPEG, PNG, or WebP");
      return;
    }

    if (file.size > ADVERTISING_ASSET_MAX_BYTES) {
      setError(
        `Image is too large (max ${Math.floor(
          ADVERTISING_ASSET_MAX_BYTES / (1024 * 1024)
        )} MB)`
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      const uploaded = await uploadAdvertisingAsset(
        file,
        form.businessName.trim()
      );
      setAdImageUrl(uploaded.publicUrl);
      setAdImagePreview(uploaded.displayUrl || uploaded.publicUrl);
      setUploadedFileName(file.name);
      setForm((prev) => ({ ...prev, needsDesign: false }));
      e.target.value = "";
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !form.placementKey) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await submitAdRequest({
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        websiteUrl: form.websiteUrl.trim(),
        placementKey: form.placementKey,
        days: dayCount,
        needsDesign: form.needsDesign,
        adImageUrl: form.needsDesign ? undefined : adImageUrl,
        message: form.message.trim() || undefined,
      });

      setSuccess(
        response.message ||
          "Your advertising request was submitted. Our team will contact you about payment and scheduling."
      );
      resetFormState();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mt-14 w-full page-width-narrow px-4 sm:px-0">
        <div className="form-card space-y-8 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Request submitted
            </h2>
            <p className="mx-auto max-w-lg text-base text-gray-600 md:text-lg">
              {success}
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              title="Submit another request"
              type="button"
              onClick={startAnotherRequest}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 w-full space-y-16 page-width-narrow px-4 sm:px-0">
      <section className="space-y-6">
        <div>
          <h2 className={sectionTitle}>
            Advertising <span className="text-[#FF8400]">Pricing</span>
          </h2>
          <p className={sectionSubtitle}>
            Choose a placement below. You pay per day — enter any number of days
            on the request form.
          </p>
        </div>

        {loadingPlacements ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500 shadow-sm">
            Loading pricing…
          </div>
        ) : sortedColumns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-600">
            Pricing is not available right now. Please check back later.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#fff8f2]">
                    {sortedColumns.map((column) => (
                      <th
                        key={column.id}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-700 md:px-6 md:text-sm"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      {sortedColumns.map((column) => (
                        <td
                          key={`${row.id}-${column.id}`}
                          className={`px-5 py-4 text-sm text-gray-800 md:px-6 md:text-base ${
                            column.id === priceColumnId
                              ? "font-semibold text-[#FF8400]"
                              : ""
                          }`}
                        >
                          {row.cells?.[column.id] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Payment is handled manually after approval. Stripe checkout coming soon.
        </p>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className={sectionTitle}>
            Request an <span className="text-[#FF8400]">Ad</span>
          </h2>
          <p className={sectionSubtitle}>
            Anyone can advertise on Cheffington — no restaurant listing required.
            Submit your details and our team will follow up.
          </p>
        </div>

        <form
          key={formKey}
          onSubmit={onSubmit}
          className="form-card space-y-10"
          autoComplete="off"
        >
            <div className="form-section space-y-6">
              <h3 className="body-title">Your details</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Business name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.businessName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, businessName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Contact name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.contactName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, contactName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, contactPhone: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Website / link URL *</label>
                <input
                  type="url"
                  placeholder="https://yourbusiness.com"
                  className="input-field"
                  value={form.websiteUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="form-section space-y-6 border-t border-black/10 pt-8">
              <h3 className="body-title">Campaign</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Placement *</label>
                  <select
                    className="input-field"
                    value={form.placementKey}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        placementKey: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a placement
                    </option>
                    {placements.map((placement) => (
                      <option key={placement.key} value={placement.key}>
                        {placement.name}
                        {placement.priceLabel ? ` — ${placement.priceLabel}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Number of days *</label>
                  <input
                    type="number"
                    min={MIN_AD_DAYS}
                    max={MAX_AD_DAYS}
                    className="input-field"
                    value={form.days}
                    placeholder={`e.g. ${MIN_AD_DAYS}`}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") {
                        setForm((prev) => ({ ...prev, days: "" }));
                        return;
                      }
                      const parsed = Number.parseInt(raw, 10);
                      if (!Number.isFinite(parsed)) return;
                      setForm((prev) => ({
                        ...prev,
                        days: String(
                          Math.max(
                            MIN_AD_DAYS,
                            Math.min(MAX_AD_DAYS, parsed)
                          )
                        ),
                      }));
                    }}
                    required
                  />
                  <p className="form-hint">
                    Enter any number from {MIN_AD_DAYS} to {MAX_AD_DAYS} days.
                  </p>
                </div>
              </div>

              {selectedPlacement && hasValidDays ? (
                <div className="rounded-xl border border-[#FF8400]/25 bg-[#fff8f2] px-5 py-4">
                  <p className="text-sm font-medium text-gray-800">
                    Estimated total
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#FF8400]">
                    ${formatMoney(estimatedTotal ?? 0)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    ${formatMoney(pricePerDay)} / day × {dayCount}{" "}
                    {dayCount === 1 ? "day" : "days"}
                    {pricePerDay === 0 ? (
                      <span className="text-amber-700">
                        {" "}
                        — set price per day in admin for an accurate estimate
                      </span>
                    ) : (
                      " — payment after approval"
                    )}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="form-section space-y-4 border-t border-black/10 pt-8">
              <h3 className="body-title">Ad creative</h3>
              <label className="form-checkbox-row rounded-lg border border-black/20 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[#FF8400]"
                  checked={form.needsDesign}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({ ...prev, needsDesign: checked }));
                    if (checked) {
                      setAdImageUrl("");
                      setAdImagePreview("");
                      setUploadedFileName("");
                    }
                  }}
                />
                <span>We&apos;ll design the ad for me</span>
              </label>

              {!form.needsDesign ? (
                <div className="form-field space-y-3">
                  <label className="form-label">Upload your ad image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ADVERTISING_ASSET_ACCEPTED_TYPES.join(",")}
                    onChange={onSelectImage}
                    disabled={uploading}
                    className="input-field"
                  />
                  {uploading ? (
                    <p className="form-hint">Uploading image…</p>
                  ) : null}
                  {uploadedFileName ? (
                    <p className="text-sm font-medium text-green-700">
                      Uploaded: {uploadedFileName}
                    </p>
                  ) : null}
                  {adImagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={adImagePreview}
                      alt="Ad preview"
                      className="max-h-48 rounded-lg border border-gray-200 bg-white object-contain p-2"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="form-field border-t border-black/10 pt-8">
              <label className="form-label">Message (optional)</label>
              <textarea
                className="input-field min-h-32 resize-y"
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Tell us about your business or campaign goals"
              />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="flex justify-center pt-2">
              <Button
                title={submitting ? "Submitting..." : "Submit request"}
                type="submit"
                disabled={!isValid || submitting || uploading}
              />
            </div>
          </form>
      </section>
    </div>
  );
}
