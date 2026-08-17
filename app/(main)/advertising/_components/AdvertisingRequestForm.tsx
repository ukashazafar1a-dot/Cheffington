"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import {
  ADVERTISING_ASSET_ACCEPTED_TYPES,
  ADVERTISING_ASSET_MAX_BYTES,
  createAdCheckoutSession,
  createAdSubscriptionCheckoutSession,
  getAdCheckoutSessionStatus,
  getAdPlacementAvailability,
  getAdPlacements,
  getAdTargetRegions,
  getChefSubscriptionPlans,
  uploadAdvertisingAsset,
} from "@/lib/api-client";
import type {
  AdPlacement,
  AdPlacementAvailability,
  AdPricingPayload,
  AdPricingRow,
  AdTargetRegion,
  ChefSubscriptionPlan,
} from "@/types/advertising";
import { MAX_AD_DAYS, MIN_AD_DAYS } from "@/types/advertising";

// Q5: monthly chef subscription plans enabled (controlled by env var on the backend).
// When false (default), nothing on the form changes — billingMode stays "one_time".
const CHEF_SUBSCRIPTIONS_ENABLED =
  process.env.NEXT_PUBLIC_CHEF_SUBSCRIPTIONS_ENABLED === "true";

const sectionTitle = "title text-center text-4xl md:text-5xl";
const sectionSubtitle = "subtitle mx-auto mt-3 max-w-2xl text-center text-xl md:text-2xl";

/** Display-only: recommended creative size for a placement (does not affect checkout). */
function getPlacementSizeLabel(placement: AdPlacement | undefined): string {
  if (!placement) return "";
  const fromLabel = String(placement.sizeLabel || "").trim();
  if (fromLabel) return fromLabel;
  const width = Number(placement.width);
  const height = Number(placement.height);
  if (width > 0 && height > 0) return `${width}×${height}`;
  return "";
}

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
    targetRegionKey: "",
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
  const [regions, setRegions] = useState<AdTargetRegion[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<ChefSubscriptionPlan[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(true);
  const [form, setForm] = useState(createInitialFormState);
  const [formKey, setFormKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adImagePreview, setAdImagePreview] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slotAvailability, setSlotAvailability] =
    useState<AdPlacementAvailability | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  // Q5: "one_time" is the default — subscription mode only shown when feature flag is on
  const [billingMode, setBillingMode] = useState<"one_time" | "subscription">("one_time");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment === "cancelled") {
      setError("Payment was cancelled. You can submit again when ready.");
      window.history.replaceState({}, "", "/advertising");
      return;
    }

    if (payment !== "success" || !sessionId) return;

    let cancelled = false;
    const maxAttempts = 8;
    const retryDelayMs = 1500;

    const clearCheckoutQuery = () => {
      window.history.replaceState({}, "", "/advertising");
    };

    const verifyPayment = async () => {
      setVerifyingPayment(true);
      setError("");

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        if (cancelled) return;

        try {
          const status = await getAdCheckoutSessionStatus(sessionId);
          if (cancelled) return;

          if (status.reviewStatus === "rejected") {
            setError(
              "This placement was already booked for that region. If you were charged, a refund has been issued."
            );
            setVerifyingPayment(false);
            clearCheckoutQuery();
            return;
          }

          if (status.paid) {
            setSuccess(
              `Advertising request received for ${status.businessName}. Our team will review your ad and email you when it is approved.`
            );
            setVerifyingPayment(false);
            clearCheckoutQuery();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
            continue;
          }

          setError(
            "We are still confirming your payment. Please refresh this page in a moment or check your email."
          );
        } catch (verifyError) {
          if (cancelled) return;

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
            continue;
          }

          setError(
            verifyError instanceof Error
              ? verifyError.message
              : "Failed to verify payment"
          );
        }
      }

      if (!cancelled) {
        setVerifyingPayment(false);
        // Keep session_id in the URL so a manual refresh can retry verification.
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    Promise.all([
      getAdPlacements(),
      getAdTargetRegions(),
      CHEF_SUBSCRIPTIONS_ENABLED
        ? getChefSubscriptionPlans()
        : Promise.resolve([] as ChefSubscriptionPlan[]),
    ])
      .then(([pricingData, regionData, planData]) => {
        setPricing(pricingData);
        setRegions(regionData);
        setSubscriptionPlans(planData);
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

  useEffect(() => {
    if (!form.placementKey || !form.targetRegionKey) {
      setSlotAvailability(null);
      return;
    }

    let cancelled = false;
    setCheckingAvailability(true);

    getAdPlacementAvailability(form.placementKey, form.targetRegionKey)
      .then((availability) => {
        if (!cancelled) {
          setSlotAvailability(availability);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlotAvailability(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingAvailability(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [form.placementKey, form.targetRegionKey]);

  const placements = pricing.placements;
  const sortedColumns = [...pricing.columns].sort((a, b) => a.order - b.order);
  const sortedRows = [...pricing.rows].sort((a, b) => a.order - b.order);

  const subscriptionPlanByKey = useMemo(() => {
    const map = new Map<string, ChefSubscriptionPlan>();
    for (const plan of subscriptionPlans) {
      map.set(plan.placementKey, plan);
    }
    return map;
  }, [subscriptionPlans]);

  const placementOptions = useMemo(() => {
    if (billingMode !== "subscription") return placements;
    return placements.filter((p) => subscriptionPlanByKey.has(p.key));
  }, [placements, billingMode, subscriptionPlanByKey]);

  const selectedSubscriptionPlan = form.placementKey
    ? subscriptionPlanByKey.get(form.placementKey)
    : undefined;

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
  const selectedPlacementSize = getPlacementSizeLabel(selectedPlacement);
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
    const base = Boolean(
      form.businessName.trim() &&
        form.contactName.trim() &&
        form.contactEmail.trim() &&
        form.contactPhone.trim() &&
        form.websiteUrl.trim() &&
        form.placementKey &&
        form.targetRegionKey &&
        (form.needsDesign || adImageUrl) &&
        slotAvailability?.available !== false
    );
    if (billingMode === "subscription") {
      return base && Boolean(selectedSubscriptionPlan);
    }
    return base && hasValidDays;
  }, [
    form,
    adImageUrl,
    hasValidDays,
    billingMode,
    selectedSubscriptionPlan,
    slotAvailability,
  ]);

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
    if (!isValid || !form.placementKey || !form.targetRegionKey) return;

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        websiteUrl: form.websiteUrl.trim(),
        placementKey: form.placementKey,
        targetRegionKey: form.targetRegionKey,
        days: billingMode === "subscription" ? 30 : dayCount,
        needsDesign: form.needsDesign,
        adImageUrl: form.needsDesign ? undefined : adImageUrl,
        message: form.message.trim() || undefined,
      };

      // Q5: route to subscription endpoint when monthly plan is selected
      const checkout =
        billingMode === "subscription"
          ? await createAdSubscriptionCheckoutSession(payload)
          : await createAdCheckoutSession(payload);

      window.location.href = checkout.checkoutUrl;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to start payment"
      );
      setSubmitting(false);
    }
  };

  if (verifyingPayment) {
    return (
      <div className="mt-14 w-full page-width-narrow px-4 sm:px-0">
        <div className="form-card py-16 text-center text-gray-600">
          Confirming your payment…
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-14 w-full page-width-narrow px-4 sm:px-0">
        <div className="form-card space-y-8 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Payment received
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
          Pay securely with Stripe when you submit your ad request below.
        </p>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className={sectionTitle}>
            Request an <span className="text-[#FF8400]">Ad</span>
          </h2>
          <p className={sectionSubtitle}>
            Anyone can advertise on Cheffington — no restaurant listing required.
            Submit your details and pay securely to send your request for review.
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

              {/* Q5: billing mode selector — only shown when feature flag is on */}
              {CHEF_SUBSCRIPTIONS_ENABLED ? (
                <div className="form-field">
                  <label className="form-label">Billing type *</label>
                  <select
                    className="input-field"
                    value={billingMode}
                    onChange={(e) => {
                      const nextMode = e.target.value as
                        | "one_time"
                        | "subscription";
                      setBillingMode(nextMode);
                      if (
                        nextMode === "subscription" &&
                        form.placementKey &&
                        !subscriptionPlanByKey.has(form.placementKey)
                      ) {
                        setForm((prev) => ({ ...prev, placementKey: "" }));
                      }
                    }}
                  >
                    <option value="one_time">One-time ad (pay per day)</option>
                    <option value="subscription">
                      Monthly chef plan (auto-renews · first month free with your
                      personal promo code)
                    </option>
                  </select>
                  {billingMode === "subscription" ? (
                    <p className="form-hint">
                      Enter the personal promo code from your chef approval email
                      on the Stripe checkout page for your first month free. A card
                      is required for automatic monthly renewal.
                    </p>
                  ) : null}
                </div>
              ) : null}

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
                    {placementOptions.map((placement) => {
                      const subPlan = subscriptionPlanByKey.get(placement.key);
                      const sizeLabel = getPlacementSizeLabel(placement);
                      const sizePart = sizeLabel ? ` (${sizeLabel})` : "";
                      const monthlyLabel =
                        billingMode === "subscription" && subPlan?.monthlyPrice
                          ? ` — ${subPlan.currency.toUpperCase()} $${formatMoney(subPlan.monthlyPrice)}/month`
                          : placement.priceLabel
                            ? ` — ${placement.priceLabel}`
                            : "";
                      return (
                        <option key={placement.key} value={placement.key}>
                          {placement.name}
                          {sizePart}
                          {monthlyLabel}
                        </option>
                      );
                    })}
                  </select>
                  {selectedPlacementSize ? (
                    <p className="form-hint">
                      Recommended image size:{" "}
                      <span className="font-semibold text-black">
                        {selectedPlacementSize} pixels
                      </span>
                    </p>
                  ) : null}
                  {billingMode === "subscription" &&
                  placementOptions.length === 0 ? (
                    <p className="form-hint text-amber-700">
                      No monthly Stripe plans are configured yet. Use one-time
                      checkout, or ask admin to add a monthly price in Stripe.
                    </p>
                  ) : null}
                </div>
                <div className="form-field">
                  <label className="form-label">Target area *</label>
                  <select
                    className="input-field"
                    value={form.targetRegionKey}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        targetRegionKey: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Select where your ad should appear
                    </option>
                    {regions.map((region) => (
                      <option key={region.key} value={region.key}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    Your ad will appear for visitors browsing this area.
                  </p>
                  {checkingAvailability ? (
                    <p className="form-hint">Checking availability…</p>
                  ) : null}
                  {slotAvailability?.available === false ? (
                    <p className="form-error mt-2">
                      {slotAvailability.message ||
                        "This placement is already booked for that region."}
                    </p>
                  ) : null}
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
                    required={billingMode !== "subscription"}
                    disabled={billingMode === "subscription"}
                  />
                  {billingMode === "subscription" ? (
                    <p className="form-hint">
                      Monthly plans run for one billing cycle (30 days) and
                      auto-renew each month.
                    </p>
                  ) : (
                    <p className="form-hint">
                      Enter any number from {MIN_AD_DAYS} to {MAX_AD_DAYS} days.
                    </p>
                  )}
                </div>
              </div>

              {selectedPlacement && (billingMode === "subscription" || hasValidDays) ? (
                <div className="rounded-xl border border-[#FF8400]/25 bg-[#fff8f2] px-5 py-4">
                  <p className="text-sm font-medium text-gray-800">
                    {billingMode === "subscription" ? "Monthly plan" : "Estimated total"}
                  </p>
                  {billingMode === "subscription" ? (
                    <>
                      <p className="mt-1 text-2xl font-bold text-[#FF8400]">
                        {selectedSubscriptionPlan?.monthlyPrice != null
                          ? `${selectedSubscriptionPlan.currency.toUpperCase()} $${formatMoney(selectedSubscriptionPlan.monthlyPrice)} / month`
                          : "Monthly plan (Stripe)"}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Billed monthly via Stripe. First month free with your
                        personal promo code at checkout. Card required for automatic
                        renewal.
                      </p>
                    </>
                  ) : (
                    <>
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
                          " — charged via Stripe at checkout (USD)"
                        )}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Have a launch discount code? Enter it on the Stripe
                        payment page.
                      </p>
                    </>
                  )}
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
                  {selectedPlacementSize ? (
                    <p className="form-hint">
                      Use{" "}
                      <span className="font-semibold text-black">
                        {selectedPlacementSize} pixels
                      </span>{" "}
                      for this placement so the ad displays correctly. JPEG, PNG,
                      or WebP.
                    </p>
                  ) : (
                    <p className="form-hint">
                      Select a placement above to see the required image size.
                      JPEG, PNG, or WebP.
                    </p>
                  )}
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
                title={
                  submitting
                    ? "Redirecting to payment..."
                    : billingMode === "subscription"
                      ? "Subscribe & submit request"
                      : "Pay & submit request"
                }
                type="submit"
                disabled={!isValid || submitting || uploading || checkingAvailability}
              />
            </div>
          </form>
      </section>
    </div>
  );
}
