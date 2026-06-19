'use client'
import Button from '@/components/Button';
import { useState } from 'react'

const AddListing = () => {
    const [value, setValue] = useState("");
    return (
        <section className="md:pb-44 md:pt-20 py-10">
            <div className="page-width w-full">
                <h1 className="title  md:pb-11 pb-6 text-center">
                    Add an <span className="text-[#FF8400]">Establishment</span>
                </h1>
                <form className="form-card page-width-narrow">
                    <div className="space-y-6">
                        <div>
                            <label className="form-label">Restaurant Name*</label>
                            <input type="text" className="input-field transition-colors " />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input type="text" placeholder='Cuisine*' className="input-field" />
                            </div>
                            <div>
                                <input type="tel" placeholder='(555) 555-5555' className="input-field" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label">Website URL</label>
                                <input type="url" className="input-field" />
                            </div>
                            <div>
                                <label className="form-label">Link to Menu</label>
                                <input type="url" className="input-field" />
                            </div>
                        </div>
                    </div>
                    {/* Address Section */}
                    <div className="mt-10">
                        <label >Restaurant Address*</label>
                        <div className="space-y-6 mt-8">
                            <input type="text" placeholder="Address Line 1" className="input-field" />
                            <input type="text" placeholder="Address Line 2" className="input-field" />
                            <div className="grid md:grid-cols-2 gap-6">
                                <input type="text" placeholder="City" className="input-field" />
                                <input type="text" placeholder="State" className="input-field" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input type="text" placeholder="Zip Code" className="input-field" />
                                <input type="text" placeholder="Country" className="input-field" />
                            </div>
                        </div>
                    </div>
                    {/* File Upload */}
                    <div className="mt-10 ">
                        <label className="form-label">
                            Upload Logo or Featured Image (optional)
                        </label>
                        <label className="block mt-8 border border-dashed md:py-26 md:px-12 px-4 py-10 text-center cursor-pointer bg-transparent ">
                            <input
                                type="file"
                                className="hidden"
                            />
                            <p className="text-[20px] font-normal text-black/50 max-sm:text-[16px]">
                                Drag & Drop Files,{" "}
                                <span className="underline text-black/50 ">
                                    Choose Files to Upload
                                </span>
                            </p>
                        </label>
                    </div>
                    {/* Checkboxes */}
                    <div className="mt-10">
                        <label className="form-label">Check all that apply:</label>
                        <div className="grid grid-cols-2 gap-y-3 mt-8 max-sm:gap-2">
                            {[
                                "Takes Reservations", "Full Bar", "Pet Friendly", "Wine & Beer",
                                "Kid Friendly", "Wheelchair Accessible", "Outdoor Seating",
                                "Accepts Credit Cards", "Full Bar", "Take-Out", "Delivery", "Wifi"
                            ].map((item, idx) => (
                                <label key={idx} className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color" />
                                    <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Chef's Notes Section */}
                    <div className="mt-10">
                        <h2 className="md:text-4xl sm:text:3xl text-2xl font-bold mb-2 tracking-[-8%]"> {`${"Share your Chef's Notes..."}`}</h2>
                        <p className="md:text-[20px] text-[18px] mb-4 tracking-[-8%]"> {`${"Don't forget to tell us about..."}`}</p>

                        <div className="flex gap-2 mb-4.5 max-md:flex-wrap">
                            {['your favorite dishes', 'the experience', 'the ambiance'].map((tag) => (
                                <span key={tag} className="bg-black  py-3 px-3 rounded-[6px]  text-center  md:basis-1/3 md:text-[20px] sm:text-[16px] text-[14px] font-medium text-[#FFF1E1]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="input-field h-44 md:h-96"
                            />
                            {!value && (
                                <span className="pointer-events-none absolute md:bottom-6 md:left-10 bottom-2.5 left-2.5 md:text-[20px] sm:text-[16px] text-[14px] text-black/60">
                                    Positive reviews only. Must be a minimum of 85 characters.
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="md:py-8 py-6 flex justify-center">
                        <Button title="Post Review" type='submit' />
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddListing
