// components/JoinToCreateProfileForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import WelcomePopup from "./WelcomePopup";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import {
  submitApplication,
  uploadApplicationDocuments,
  APPLICATION_DOC_ACCEPTED_TYPES,
  APPLICATION_DOC_MAX_BYTES,
  APPLICATION_DOC_MAX_FILES,
  type ApplicationType,
} from "@/lib/api-client";

const initialForm = {
  applicationType: "chef" as ApplicationType,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  currentRestaurant: "",
  website: "",
  jobTitle: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  professionalEmail: "",
  professionalProof: "",
  printFirstName: "",
  printLastName: "",
  declarationAccepted: false,
  termsAccepted: false,
};

const JoinToCreateProfileForm = () => {
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofUploadError, setProofUploadError] = useState("");

  const [formData, setFormData] = useState(initialForm);

  // Clear any leftover draft so refresh always starts with a clean form
  useEffect(() => {
    try {
      localStorage.removeItem("chefForm");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const t = searchParams.get("type");
    if (t === "chef" || t === "business_owner") {
      setFormData((prev: typeof initialForm) => ({
        ...prev,
        applicationType: t,
      }));
    }
  }, [searchParams]);

  const isChef = formData.applicationType === "chef";
  const isOwner = formData.applicationType === "business_owner";
  const isPublic = formData.applicationType === "public";

  const setApplicationType = (applicationType: ApplicationType) => {
    setFormData((prev: typeof initialForm) => ({
      ...prev,
      applicationType,
    }));
    // Clear proof uploads when switching away from chef/owner verification flows
    if (applicationType === "public") {
      setProofFiles([]);
      setProofUploadError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload: typeof formData & { applicationDocuments?: string[] } = {
        ...formData,
      };
      if (isOwner || isPublic) {
        delete (payload as { jobTitle?: string }).jobTitle;
        delete (payload as { professionalEmail?: string }).professionalEmail;
      }
      if (isPublic) {
        delete (payload as { professionalProof?: string }).professionalProof;
        delete (payload as { applicationDocuments?: string[] })
          .applicationDocuments;
        if (!payload.currentRestaurant) {
          payload.currentRestaurant = "";
        }
      }

      const hasLegacyProof =
        typeof formData.professionalProof === "string" &&
        formData.professionalProof.length > 0;
      const hasProofUpload = proofFiles.length > 0 || hasLegacyProof;
      const hasProfessionalEmail = Boolean(
        String(formData.professionalEmail || "").trim()
      );

      if (isChef) {
        if (!hasProfessionalEmail && !hasProofUpload) {
          toast.error(
            "Provide a professional/business email or upload proof of employment"
          );
          setLoading(false);
          return;
        }
      }

      if (isOwner) {
        if (!hasProofUpload) {
          toast.error("Please upload at least one document or image");
          setLoading(false);
          return;
        }
      }

      // Public individuals: no proof documents or professional email required
      if ((isChef || isOwner) && hasProofUpload) {
        if (proofFiles.length > 0) {
          const documentUrls = await uploadApplicationDocuments(
            proofFiles,
            formData.firstName,
            formData.lastName,
            formData.applicationType
          );
          payload.applicationDocuments = documentUrls;
          payload.professionalProof = documentUrls[0];
        } else if (hasLegacyProof) {
          payload.applicationDocuments = [formData.professionalProof];
          payload.professionalProof = formData.professionalProof;
        }
      }

      if (isChef && !hasProofUpload) {
        delete (payload as { professionalProof?: string }).professionalProof;
        delete (payload as { applicationDocuments?: string[] })
          .applicationDocuments;
      }

      await submitApplication(payload);

      toast.success("Application submitted successfully");
      setShowPopup(true);

      setFormData(initialForm);
      setProofFiles([]);
      setProofUploadError("");
      localStorage.removeItem("chefForm");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error submitting form";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleContactClick = () => {
    console.log("Contact clicked");
  };

  return (
    <>
      <section className="md:pb-44 md:pt-20 py-10">
        <div className="page-width w-full">
          <div className="mb-12">
            <h1 className="title text-center mb-1.5">
              Be a <span className="text-[#FF8400]">Cheffington</span>
            </h1>
            <h2 className="subtitle text-center mb-8 ">Create Your Profile</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="form-card page-width-narrow"
          >
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <button
                type="button"
                onClick={() => setApplicationType("chef")}
                className={`px-6 py-2 rounded-md border-2 border-black font-medium transition-colors ${
                  isChef ? "bg-[#FF8400] text-black" : "bg-white hover:bg-gray-50"
                }`}
              >
                Join as Chef
              </button>
              <button
                type="button"
                onClick={() => setApplicationType("business_owner")}
                className={`px-6 py-2 rounded-md border-2 border-black font-medium transition-colors ${
                  isOwner ? "bg-[#FF8400] text-black" : "bg-white hover:bg-gray-50"
                }`}
              >
                Join as Business Owner
              </button>
            </div>

            {/* Full Name */}
            <div className="mb-10">
              <label className="form-label">
                Full Name
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="input-field"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    className="input-field"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="form-label">
                    Create Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    className="input-field pr-10"
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="form-label">
                    Verify Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-[42px] text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Restaurant / business / optional org for public */}
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    {isOwner
                      ? "Business / Restaurant Name"
                      : isPublic
                        ? "Organization (optional)"
                        : "Current Restaurant"}
                  </label>
                  <input
                    type="text"
                    name="currentRestaurant"
                    value={formData.currentRestaurant}
                    className="input-field"
                    onChange={handleChange}
                    required={!isPublic}
                    placeholder={isPublic ? "Optional" : undefined}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    className="input-field"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {isChef && (
              <div className="mb-10">
                <label className="form-label">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  className="input-field"
                  onChange={handleChange}
                  required={isChef}
                />
              </div>
            )}

            {/* Address */}
            <div className="mb-10">
              <label className="form-label">
                {isOwner
                  ? "Business Address"
                  : isPublic
                    ? "Your Address"
                    : "Restaurant Address"}
              </label>

              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                placeholder="Address Line 1"
                className="input-field"
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                placeholder="Address Line 2"
                className="input-field"
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="city"
                  value={formData.city}
                  placeholder="City"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
                <input
                  name="state"
                  value={formData.state}
                  placeholder="State"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  placeholder="Zip Code"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
                <input
                  name="country"
                  value={formData.country}
                  placeholder="Country"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {(isChef || isOwner) && (
              <>
                {isChef ? (
                  <div className="mb-10">
                    <label className="form-label">
                      Professional / Business Email (optional if you upload proof)
                    </label>
                    <input
                      type="email"
                      name="professionalEmail"
                      value={formData.professionalEmail}
                      placeholder="e.g. chef@yourrestaurant.com"
                      className="input-field"
                      onChange={handleChange}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Prefer a work/business email. Don&apos;t have one? Upload proof
                      of employment below instead.
                    </p>
                  </div>
                ) : null}

                <div className="mb-10">
                  <label className="form-label">
                    {isOwner
                      ? "Business Verification Documents"
                      : "Upload Proof of Employment"}{" "}
                    — documents and images (up to {APPLICATION_DOC_MAX_FILES})
                    {isChef ? " (optional if you enter a professional email)" : ""}
                  </label>
                  {isChef ? (
                    <p className="mb-3 text-sm text-gray-600">
                      Don&apos;t have a professional email? Just upload a pay stub or
                      proof of employment here!
                    </p>
                  ) : null}
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    className="input-field"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files ?? []);
                      e.target.value = "";
                      setProofUploadError("");

                      if (selected.length === 0) return;

                      const invalidType = selected.find(
                        (file) =>
                          !APPLICATION_DOC_ACCEPTED_TYPES.includes(
                            file.type as (typeof APPLICATION_DOC_ACCEPTED_TYPES)[number]
                          )
                      );
                      if (invalidType) {
                        setProofUploadError(
                          `"${invalidType.name}": use PDF, JPEG, PNG, or WebP.`
                        );
                        return;
                      }

                      const tooLarge = selected.find(
                        (file) => file.size > APPLICATION_DOC_MAX_BYTES
                      );
                      if (tooLarge) {
                        setProofUploadError(
                          `"${tooLarge.name}" must be 10 MB or smaller.`
                        );
                        return;
                      }

                      setProofFiles((prev) => {
                        const merged = [...prev, ...selected];
                        if (merged.length > APPLICATION_DOC_MAX_FILES) {
                          setProofUploadError(
                            `Maximum ${APPLICATION_DOC_MAX_FILES} files allowed.`
                          );
                          return merged.slice(0, APPLICATION_DOC_MAX_FILES);
                        }
                        return merged;
                      });
                    }}
                  />
                  {proofFiles.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {proofFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-3 text-sm text-gray-700"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            className="shrink-0 text-red-600 underline"
                            onClick={() =>
                              setProofFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {proofUploadError ? (
                    <p className="text-sm mt-2 text-red-600">{proofUploadError}</p>
                  ) : null}
                </div>
              </>
            )}

            {/* Print Name */}
            <div className="mb-8">
              <label className="form-label">
                Print Name
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="printFirstName"
                  value={formData.printFirstName}
                  placeholder="First"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
                <input
                  name="printLastName"
                  value={formData.printLastName}
                  placeholder="Last"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  name="declarationAccepted"
                  checked={formData.declarationAccepted}
                  onChange={handleChange}
                  required
                />{" "}
                Declaration
              </label>
            </div>

            <div className="mb-10">
              <label>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />{" "}
                Terms
              </label>
            </div>

            <div className="md:py-8 py-6 flex justify-center">
              <Button
                type="submit"
                title={loading ? "Loading..." : "CREATE PROFILE"}
              />
            </div>
          </form>
        </div>
      </section>

      {showPopup && (
        <WelcomePopup
          onClose={handleClosePopup}
          onContactClick={handleContactClick}
        />
      )}
    </>
  );
};

export default JoinToCreateProfileForm;
