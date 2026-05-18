// components/JoinToCreateProfileForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import WelcomePopup from "./WelcomePopup";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { submitApplication, type ApplicationType } from "@/lib/api-client";

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

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chefForm");
      return saved ? JSON.parse(saved) : initialForm;
    }
    return initialForm;
  });

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

  const setApplicationType = (applicationType: ApplicationType) => {
    setFormData((prev: typeof initialForm) => {
      const updated = { ...prev, applicationType };
      localStorage.setItem("chefForm", JSON.stringify(updated));
      return updated;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(updated);
    localStorage.setItem("chefForm", JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { ...formData };
      if (isOwner) {
        delete (payload as { jobTitle?: string }).jobTitle;
        delete (payload as { professionalEmail?: string }).professionalEmail;
        delete (payload as { professionalProof?: string }).professionalProof;
      }

      await submitApplication(payload);

      toast.success("Application submitted successfully");
      setShowPopup(true);

      setFormData(initialForm);
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
            className="border-3 rounded-[9px] border-black md:px-10! md:py-12! py-8! px-4! page-width-narrow"
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
              <label className="block mb-2 text-lg font-medium!">
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
                  <label className="block mb-2 text-lg font-medium!">
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
                  <label className="block mb-2 text-lg font-medium!">
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
                  <label className="block mb-2 text-lg font-medium!">
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
                  <label className="block mb-2 text-lg font-medium!">
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

            {/* Restaurant / business */}
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-lg font-medium!">
                    {isOwner ? "Business / Restaurant Name" : "Current Restaurant"}
                  </label>
                  <input
                    type="text"
                    name="currentRestaurant"
                    value={formData.currentRestaurant}
                    className="input-field"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium!">
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
                <label className="block mb-2 text-lg font-medium!">
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
              <label className="block mb-2 text-lg font-medium!">
                {isOwner ? "Business Address" : "Restaurant Address"}
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

            {isChef && (
              <>
                <div className="mb-10">
                  <input
                    type="email"
                    name="professionalEmail"
                    value={formData.professionalEmail}
                    placeholder="Professional email"
                    className="input-field"
                    onChange={handleChange}
                    required={isChef}
                  />
                </div>

                <div className="mb-10">
                  <input
                    type="text"
                    name="professionalProof"
                    value={formData.professionalProof}
                    placeholder="Professional Proof"
                    className="input-field"
                    onChange={handleChange}
                    required={isChef}
                  />
                </div>
              </>
            )}

            {/* Print Name */}
            <div className="mb-8">
              <label className="block mb-2 text-lg font-medium!">
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
