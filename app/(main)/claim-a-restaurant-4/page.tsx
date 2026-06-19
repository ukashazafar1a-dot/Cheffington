'use client'
import Button from '@/components/Button';
import React, { useState } from 'react'

interface RestaurantForm {
  restaurantName: string;
  cuisine: string;
  phone: string;
  websiteUrl: string;
  linkToMenu: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  features: string[];
}

const MasterpieceForm = () => {
  const [formData, setFormData] = useState<RestaurantForm>({
    restaurantName: '',
    cuisine: '',
    phone: '',
    websiteUrl: '',
    linkToMenu: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    description: '',
    features: []
  });

  const amenities = [
    "Takes Reservations", "Pet Friendly", "Kid Friendly",
    "Outdoor Seating", "Full Bar", "Delivery",
    "Wine & Beer", "Wheelchair Accessible",
    "Accepts Credit Cards", "Take-Out", "Wifi"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (item: string) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(item);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter(f => f !== item)
          : [...prev.features, item]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="md:pb-44 md:pt-20 py-10">
      <div className="page-width">

        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="title mb-2">
            Perfect Your <span className="text-[#FF8400]">Masterpiece</span>
          </h1>
          <p className="subtitle">You may edit and/or add details below.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-card page-width-narrow">
          <div className="form-section">
            <label className="form-label">Restaurant Name</label>
            <input
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleInputChange}
              type="text"
              className="input-field"
            />
          </div>

          <div className="form-section form-grid">
            <div>
              {/* <label className="block mb-2 text-lg font-medium">Cuisine</label> */}
              <input
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
                type="text"
                placeholder='Cuisine'
                className="input-field"
              />
            </div>
            <div>
              {/* <label className="block mb-2 text-lg font-medium">Phone</label> */}
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="text"
                placeholder='(555) 555-5555'
                className="input-field"
              />
            </div>
          </div>

          {/* Website + Menu */}
          <div className="form-section form-grid">
            <div>
              {/* <label className="block mb-2 text-lg font-medium">Website URL</label> */}
              <input
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                type="text"
                placeholder='Website URL'
                className="input-field"
              />
            </div>
            <div>
              {/* <label className="block mb-2 text-lg font-medium">Menu Link</label> */}
              <input
                name="linkToMenu"
                value={formData.linkToMenu}
                onChange={handleInputChange}
                type="text"
                placeholder='Menu Link'
                className="input-field"
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-section">
            <label className="form-label">Restaurant Address</label>
            <div className="space-y-4">
              <input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="input-field"
              />
              <input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="input-field"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="input-field" />
                <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="input-field" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Zip Code" className="input-field" />
                <input name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" className="input-field" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <p className="form-label">Upload Logo or Featured Image (optional)</p>

            {/* File Upload with note */}
            <label className="block border-1 border-dashed border-black/50 md:py-20 md:px-12 px-4 py-10 text-center cursor-pointer bg-transparent rounded-lg">
              <input type="file" className="hidden" />
              <p className="md:text-[20px] text-[18px] font-normal text-black/50 max-sm:text-[16px]">
                Drag & Drop Files,{" "}
                <span className="underline text-black/50">Choose Files to Upload</span>
              </p>
            </label>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <label className="form-label">Check all that apply:</label>

            <div className="grid grid-cols-2 gap-y-3 mt-8 max-sm:gap-2">
              {amenities.map((item, idx) => (
                <label key={idx} className="flex items-center md:space-x-3 space-x-2 cursor-pointer group ">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                    className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color"
                  />
                  <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <label className="form-label">Write Brief Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field h-44 md:h-80"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">

            <Button title='Complete' type='submit' />
          </div>

        </form>
      </div>
    </section>
  )
}

export default MasterpieceForm