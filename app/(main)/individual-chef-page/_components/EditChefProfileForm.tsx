"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { getPublishedRestaurants, updateChefMe } from "@/lib/api-client";
import type { ChefProfile } from "@/types/chef";
import type { PublicRestaurant } from "@/types/restaurant";

type Props = {
  chef: ChefProfile;
  token: string;
  onSaved: (chef: ChefProfile) => void;
};

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
    bio: chef.bio || "",
    instagramUrl: chef.instagramUrl || "",
    facebookUrl: chef.facebookUrl || "",
    spotifyUrl: chef.spotifyUrl || "",
  });
  const [affiliatedRestaurantIds, setAffiliatedRestaurantIds] = useState<
    string[]
  >(chef.affiliatedRestaurantIds?.map(String) || []);
  const [publishedRestaurants, setPublishedRestaurants] = useState<
    PublicRestaurant[]
  >([]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getPublishedRestaurants()
      .then((res) => {
        if (!cancelled) setPublishedRestaurants(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setPublishedRestaurants([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const toggleAffiliation = (id: string) => {
    setAffiliatedRestaurantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

  return (
    <form
      onSubmit={handleSave}
      className="mb-8 w-full rounded-3xl border-2 border-black bg-white p-6"
    >
      <h3 className="mb-4 text-xl font-bold">Edit profile</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="form-label">First name</label>
          <input
            className="input-field"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">Last name</label>
          <input
            className="input-field"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="form-label">Job title</label>
          <input
            className="input-field"
            value={form.jobTitle}
            onChange={(e) => setField("jobTitle", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Workplace / current restaurant</label>
          <input
            className="input-field"
            value={form.currentRestaurant}
            onChange={(e) => setField("currentRestaurant", e.target.value)}
            placeholder="Where you work"
          />
        </div>
        <div>
          <label className="form-label">Restaurant link</label>
          <input
            className="input-field"
            value={form.currentRestaurantUrl}
            onChange={(e) => setField("currentRestaurantUrl", e.target.value)}
            placeholder="https://restaurant-website.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Website</label>
          <input
            className="input-field"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Instagram URL</label>
          <input
            className="input-field"
            value={form.instagramUrl}
            onChange={(e) => setField("instagramUrl", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Facebook URL</label>
          <input
            className="input-field"
            value={form.facebookUrl}
            onChange={(e) => setField("facebookUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Spotify URL</label>
          <input
            className="input-field"
            value={form.spotifyUrl}
            onChange={(e) => setField("spotifyUrl", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">About</label>
          <textarea
            className="input-field min-h-32"
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            maxLength={4000}
            placeholder="Who you are, where you work, CV highlights..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">Affiliated restaurants</label>
          <p className="mb-2 text-sm text-gray-600">
            Select the Cheffington listings you work at or are affiliated with.
            These show on your public profile and in chef search.
          </p>
          <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-black/15 p-3">
            {publishedRestaurants.length === 0 ? (
              <p className="text-sm text-gray-500">
                No published restaurants yet.
              </p>
            ) : (
              publishedRestaurants.map((restaurant) => (
                <label
                  key={restaurant._id}
                  className="flex cursor-pointer items-start gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={affiliatedRestaurantIds.includes(restaurant._id)}
                    onChange={() => toggleAffiliation(restaurant._id)}
                  />
                  <span>
                    <span className="font-medium">{restaurant.name}</span>
                    {restaurant.city || restaurant.state ? (
                      <span className="text-gray-600">
                        {" "}
                        · {[restaurant.city, restaurant.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    ) : null}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
      {error ? <p className="form-error mt-3">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          title={saving ? "Saving..." : "Save"}
          type="submit"
          loading={saving}
          disabled={saving}
        />
        <button
          type="button"
          className="underline font-semibold"
          onClick={() => setOpen(false)}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
