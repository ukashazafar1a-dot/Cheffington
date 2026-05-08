// components/JoinToCreateProfileForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

import Button from '@/components/Button'
import WelcomePopup from './WelcomePopup'

const JoinToCreateProfileForm = () => {
    const [showPopup, setShowPopup] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setShowPopup(true) // Show popup after submission
    }

    const handleClosePopup = () => {
        setShowPopup(false)
        // Optional: Redirect or perform other actions after closing
        // router.push('/dashboard')
    }

    const handleContactClick = () => {
        // Handle contact click - open contact form, modal, or navigate
        console.log('Contact clicked')
        // Example: Open a contact modal or redirect
        // router.push('/contact')
    }

    return (
        <>
            <section className="md:pb-44 md:pt-20 py-10">
                <div className="page-width w-full">
                    {/* Title */}
                    <div className='mb-12'>
                        <h1 className="title text-center mb-1.5">
                            Be a <span className="text-[#FF8400]">Cheffington</span>
                        </h1>
                        <h2 className="subtitle text-center mb-8 ">
                            Create Your Profile
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="border-3 rounded-[9px] border-black md:px-10! md:py-12! py-8! px-4! page-width-narrow"
                    >
                        {/* Full Name */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">Full Name</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" placeholder="First" className="input-field" />
                                <input type="text" placeholder="Last" className="input-field" />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Email</label>
                                    <input type="email" placeholder="" className="input-field" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Phone</label>
                                    <input type="tel" placeholder="" className="input-field" />
                                </div>
                            </div>
                        </div>

                        {/* Onsite Password & Verify */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Create Password</label>
                                    <input type="password" className="input-field" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Verify Password</label>
                                    <input type="password" placeholder="" className="input-field" />
                                </div>
                            </div>
                        </div>

                        {/* Current Restaurant & Website */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Current Restaurant</label>
                                    <input type="text" placeholder="" className="input-field" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Website</label>
                                    <input type="url" placeholder="" className="input-field" />
                                </div>
                            </div>
                        </div>

                        {/* Job Title */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">Job Title</label>
                            <input type="text" placeholder="" className="input-field" />
                        </div>

                        {/* Restaurant Address */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">Restaurant Address</label>
                            <div className="space-y-4">
                                <input type="text" placeholder="Address Line 1" className="input-field" />
                                <input type="text" placeholder="Address Line 2" className="input-field" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="input-field" />
                                    <input type="text" placeholder="State" className="input-field" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Zip Code" className="input-field" />
                                    <select className="input-field">
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Qualification Section */}
                        <div className="mb-10">
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mb-4">
                                To qualify as a Cheffington, you must enter a valid restaurant email (ex. may be submitted from any of our global locations).
                            </p>
                            <div className="mb-4">
                                <input type="email" placeholder="Professional email" className="input-field" />
                            </div>
                        </div>

                        <div className='mb-10'>
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mb-4">Phone optional — restaurant may take up to part of employment</p>

                            {/* File Upload with note */}
                            <label className="block border border-dashed border-black/50 md:py-20 md:px-12 px-4 py-10 text-center cursor-pointer bg-transparent rounded-lg">
                                <input type="file" className="hidden" />
                                <p className="md:text-[20px] text-[18px] font-normal text-black/50 max-sm:text-[16px]">
                                    Drag & Drop Files,{" "}
                                    <span className="underline text-black/50">Choose Files to Upload</span>
                                </p>
                            </label>
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mt-2 mb-4 ">Must be dated in the last six months</p>
                        </div>

                        {/* Declaration */}
                        <div className="mb-10">
                            <div className="text-[20px] leading-normal tracking-[-8%] mb-2 text-lg font-bold">Declaration</div>
                            <label className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                                <input type="checkbox" className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color" />
                                <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">
                                    Information submitted without above is consent to the best of my knowledge.
                                </span>
                            </label>
                        </div>

                        {/* Signature */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium">Signature</label>
                            <div className="border border-black h-36 bg-transparent" />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="mb-10">
                            <label className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                                <input type="checkbox" className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color" />
                                <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium ">
                                    I have read and accept the <span className='underline'><Link href="/terms">terms and agreement</Link>.</span>
                                </span>
                            </label>
                        </div>

                        {/* Part Name */}
                        <div className="mb-8">
                            <label className="block mb-2 text-lg font-medium!">Print Name</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" placeholder="First" className="input-field" />
                                <input type="text" placeholder="Last" className="input-field" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:py-8 py-6 flex justify-center">
                            <Button type='submit' title='CREATE PROFILE' />
                        </div>
                    </form>
                </div>
            </section>

            {/* Popup */}
            {showPopup && (
                <WelcomePopup
                    onClose={handleClosePopup}
                    onContactClick={handleContactClick}
                />
            )}
        </>
    )
}

export default JoinToCreateProfileForm