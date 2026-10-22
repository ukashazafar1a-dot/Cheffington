"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import {
  getPublishedRestaurantsByIds,
  searchPublishedRestaurants,
  updateChefMe,
} from "@/lib/api-client";
import type { ChefProfile } from "@/types/chef";
import type { PublicRestaurant } from "@/types/restaurant";

type Props = {
  chef: ChefProfile;
  token: string;
  onSaved: (chef: ChefProfile) => void;
};

function restaurantLocation(restaurant: PublicRestaurant) {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ");
}

export default function EditChefProfileForm({ chef, token, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: chef.firstName || "",
    lastName: chef.lastName || "",
    jobTitle: chef.jobTitle || "",
    currentRestaurant: chef.currentRestaurant || "",
    currentRestaurantUrl: chef.currentRestaurantUrl || "",
    website: chef.website || "",
    phone: chef.phone || "",
    bio: chef.bio || "",
    instagramUrl: chef.instagramUrl || "",
    facebookUrl: chef.facebookUrl || "",
    spotifyUrl: chef.spotifyUrl || "",
  });
  const [affiliatedRestaurantIds, setAffiliatedRestaurantIds] = useState<
    string[]
  >(chef.affiliatedRestaurantIds?.map(String) || []);
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    PublicRestaurant[]
  >([]);
  const [affiliationQuery, setAffiliationQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicRestaurant[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedIdSet = useMemo(
    () => new Set(affiliatedRestaurantIds.map(String)),
    [affiliatedRestaurantIds]
  );

  // Sync fields when the form opens (not on every chef prop change — e.g. photo
  // upload must not wipe in-progress edits).
  useEffect(() => {
    if (!open) return;
    setForm({
      firstName: chef.firstName || "",
      lastName: chef.lastName || "",
      jobTitle: chef.jobTitle || "",
      currentRestaurant: chef.currentRestaurant || "",
      currentRestaurantUrl: chef.currentRestaurantUrl || "",
      website: chef.website || "",
      phone: chef.phone || "",
      bio: chef.bio || "",
      instagramUrl: chef.instagramUrl || "",
      facebookUrl: chef.facebookUrl || "",
      spotifyUrl: chef.spotifyUrl || "",
    });
    setAffiliatedRestaurantIds(
      chef.affiliatedRestaurantIds?.map(String) || []
    );
    setAffiliationQuery("");
    setSearchResults([]);
    setSearchError("");
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when open flips on
  }, [open]);

  // Load currently selected affiliations once when the form opens.
  // Later add/remove updates selectedRestaurants locally (avoids fetch races).
  useEffect(() => {
    if (!open) return;
    const ids = chef.affiliatedRestaurantIds?.map(String) || [];
    if (ids.length === 0) {
      setSelectedRestaurants([]);
      return;
    }

    let cancelled = false;
    getPublishedRestaurantsByIds(ids)
      .then((res) => {
        if (cancelled) return;
        const byId = new Map(
          (res.data ?? []).map((restaurant) => [
            String(restaurant._id),
            restaurant,
          ])
        );
        setSelectedRestaurants(
          ids
            .map((id) => byId.get(String(id)))
            .filter((restaurant): restaurant is PublicRestaurant =>
              Boolean(restaurant)
            )
        );
      })
      .catch(() => {
        if (!cancelled) setSelectedRestaurants([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- snapshot on open only
  }, [open]);

  // Debounced server search — do not load the full restaurant catalog.
  useEffect(() => {
    if (!open) return;
    const query = affiliationQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearching(false);
      setSearchError("");
      return;
    }

    let cancelled = false;
    setSearching(true);
    setSearchError("");
    const timer = window.setTimeout(() => {
      searchPublishedRestaurants(query, 40)
        .then((res) => {
          if (cancelled) return;
          setSearchResults(res.data ?? []);
        })
        .catch((err) => {
          if (cancelled) return;
          setSearchResults([]);
          setSearchError(
            err instanceof Error ? err.message : "Search failed"
          );
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, affiliationQuery]);

  const toggleAffiliation = (restaurant: PublicRestaurant) => {
    const id = String(restaurant._id);
    setAffiliatedRestaurantIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    setSelectedRestaurants((prev) => {
      if (prev.some((item) => String(item._id) === id)) {
        return prev.filter((item) => String(item._id) !== id);
      }
      return [...prev, restaurant];
    });
  };

  const removeAffiliation = (id: string) => {
    const key = String(id);
    setAffiliatedRestaurantIds((prev) => prev.filter((item) => item !== key));
    setSelectedRestaurants((prev) =>
      prev.filter((item) => String(item._id) !== key)
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const updated = await updateChefMe(token, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        jobTitle: form.jobTitle.trim(),
        currentRestaurant: form.currentRestaurant.trim(),
        currentRestaurantUrl: form.currentRestaurantUrl.trim(),
        website: form.website.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        instagramUrl: form.instagramUrl.trim(),
        facebookUrl: form.facebookUrl.trim(),
        spotifyUrl: form.spotifyUrl.trim(),
        affiliatedRestaurantIds,
      });
      onSaved(updated);
      setOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button
        title="EDIT PROFILE"
        onClick={() => setOpen(true)}
        className="min-h-10! text-[14px]! px-4! min-w-36!"
      />
    );
  }

  const queryTrimmed = affiliationQuery.trim();
  const showSearchHint = queryTrimmed.length > 0 && queryTrimmed.length < 2;

  return (
    <form
      onSubmit={handleSave}
      className="edit-profile-form mb-8 w-full rounded-3xl border-2 border-black bg-white p-6 md:p-8 [&_label]:font-medium [&_label]:tracking-normal"
    >
      <h3 className="mb-6 text-2xl font-bold tracking-normal text-black">
        Edit profile
      </h3>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            First name
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Last name
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Job title
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.jobTitle}
            onChange={(e) => setField("jobTitle", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            {chef.applicationType === "business_owner"
              ? "Business / workplace name"
              : "Workplace / current restaurant"}
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.currentRestaurant}
            onChange={(e) => setField("currentRestaurant", e.target.value)}
            placeholder={
              chef.applicationType === "business_owner"
                ? "Your business name"
                : "Where you work"
            }
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            {chef.applicationType === "business_owner"
              ? "Business link"
              : "Restaurant link"}
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.currentRestaurantUrl}
            onChange={(e) => setField("currentRestaurantUrl", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Website
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Telephone number
          </label>
          <input
            type="tel"
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            required
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Instagram URL
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.instagramUrl}
            onChange={(e) => setField("instagramUrl", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Facebook URL
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.facebookUrl}
            onChange={(e) => setField("facebookUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Spotify URL
          </label>
          <input
            className="input-field tracking-normal text-base! md:text-lg!"
            value={form.spotifyUrl}
            onChange={(e) => setField("spotifyUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label tracking-normal! text-base! font-semibold!">
            About
          </label>
          <textarea
            className="input-field min-h-32 tracking-normal text-base! md:text-lg!"
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            maxLength={4000}
            placeholder="Who you are, where you work, CV highlights..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label tracking-normal! text-base! font-semibold!">
            Affiliated restaurants
          </label>
          <p className="mb-3 text-sm leading-relaxed tracking-normal text-gray-600">
            Search and select the Cheffington listings you work at or are
            affiliated with. These show on your public profile and in chef
            search.
          </p>

          {selectedRestaurants.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedRestaurants.map((restaurant) => {
                const location = restaurantLocation(restaurant);
                return (
                  <button
                    key={`selected-${restaurant._id}`}
                    type="button"
                    onClick={() => removeAffiliation(String(restaurant._id))}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/20 bg-[#FFF1E1] px-3 py-1 text-left text-sm tracking-normal text-black"
                    title="Remove affiliation"
                  >
                    <span className="truncate">
                      <span className="font-medium">{restaurant.name}</span>
                      {location ? (
                        <span className="text-gray-600"> · {location}</span>
                      ) : null}
                    </span>
                    <span aria-hidden className="text-gray-500">
                      ×
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <input
            type="search"
            className="input-field mb-3 tracking-normal text-base! md:text-lg!"
            value={affiliationQuery}
            onChange={(e) => setAffiliationQuery(e.target.value)}
            placeholder="Search by restaurant name, city, or state…"
            autoComplete="off"
          />

          <div className="max-h-56 space-y-2.5 overflow-y-auto rounded-xl border border-black/15 p-3">
            {showSearchHint ? (
              <p className="text-sm tracking-normal text-gray-500">
                Type at least 2 characters to search.
              </p>
            ) : searching ? (
              <p className="text-sm tracking-normal text-gray-500">
                Searching…
              </p>
            ) : searchError ? (
              <p className="text-sm tracking-normal text-red-600">
                {searchError}
              </p>
            ) : queryTrimmed.length < 2 ? (
              <p className="text-sm tracking-normal text-gray-500">
                {selectedRestaurants.length > 0
                  ? "Search to add more restaurants."
                  : "No published restaurants selected yet. Search to find listings."}
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-sm tracking-normal text-gray-500">
                No restaurants match “{queryTrimmed}”.
              </p>
            ) : (
              searchResults.map((restaurant) => {
                const id = String(restaurant._id);
                const location = restaurantLocation(restaurant);
                const checked = selectedIdSet.has(id);
                return (
                  <label
                    key={restaurant._id}
                    className="flex cursor-pointer items-start gap-2.5 text-sm font-normal! tracking-normal! leading-snug text-black"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={checked}
                      onChange={() => toggleAffiliation(restaurant)}
                    />
                    <span className="tracking-normal">
                      <span className="font-medium">{restaurant.name}</span>
                      {location ? (
                        <span className="text-gray-600"> · {location}</span>
                      ) : null}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>
      {error ? <p className="form-error mt-3 tracking-normal">{error}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          title={saving ? "Saving..." : "Save"}
          type="submit"
          loading={saving}
          disabled={saving}
        />
        <button
          type="button"
          className="font-semibold tracking-normal underline"
          onClick={() => setOpen(false)}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
