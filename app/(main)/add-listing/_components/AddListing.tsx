'use client'

import Button from '@/components/Button';
import { useState, ChangeEvent, useCallback, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Zod Schema for validation
const addListingSchema = z.object({
    restaurantName: z.string().min(1, 'Restaurant name is required').max(100, 'Restaurant name is too long'),
    cuisine: z.string().min(1, 'Cuisine is required'),
    phone: z.string().min(10, 'Valid phone number is required').regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
    websiteUrl: z.string().url('Invalid website URL').optional().or(z.literal('')),
    linkToMenu: z.string().url('Invalid menu URL').optional().or(z.literal('')),
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    featuredImage: z.any().optional(),
    amenities: z.array(z.string()).optional(),
    chefNotes: z.string()
        .min(85, 'Chef notes must be at least 85 characters')
        .max(2000, 'Chef notes must be less than 2000 characters'),
})

type AddListingFormData = z.infer<typeof addListingSchema>

const amenitiesList = [
    "Takes Reservations", "Full Bar", "Pet Friendly", "Wine & Beer",
    "Kid Friendly", "Wheelchair Accessible", "Outdoor Seating",
    "Accepts Credit Cards", "Take-Out", "Delivery", "Wifi"
]

const AddListing = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [chefNotesValue, setChefNotesValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<AddListingFormData>({
        resolver: zodResolver(addListingSchema),
        mode: 'onChange',
        defaultValues: {
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
            chefNotes: '',
            amenities: [],
        }
    })

    // Watch chefNotes without triggering memoization warning
    const watchedChefNotes = watch('chefNotes')

    // Update local state when watched value changes
    useEffect(() => {
        if (watchedChefNotes !== undefined) {
            setChefNotesValue(watchedChefNotes)
        }
    }, [watchedChefNotes])

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] || null
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit for images
                toast.error('File size must be less than 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file')
                return
            }
            setUploadedFile(file)
            setValue('featuredImage', file)
        }
    }, [setValue])

    const handleAmenityChange = useCallback((amenity: string) => {
        setSelectedAmenities(prev => {
            const updated = prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]

            setValue('amenities', updated)
            return updated
        })
    }, [setValue])

    const onSubmit = useCallback(async (data: AddListingFormData): Promise<void> => {
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Single console object with all form data
        console.log('📝 Add Listing Submission Data:', {
            restaurantInfo: {
                name: data.restaurantName,
                cuisine: data.cuisine,
                phone: data.phone,
                website: data.websiteUrl || 'Not provided',
                menuLink: data.linkToMenu || 'Not provided',
            },
            address: {
                line1: data.addressLine1,
                line2: data.addressLine2 || 'Not provided',
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
                fullAddress: `${data.addressLine1}, ${data.city}, ${data.state} ${data.zipCode}, ${data.country}`,
            },
            amenities: {
                selected: data.amenities || [],
                count: data.amenities?.length || 0,
            },
            media: uploadedFile ? {
                name: uploadedFile.name,
                size: `${(uploadedFile.size / 1024).toFixed(2)} KB`,
                type: uploadedFile.type,
            } : 'No image uploaded',
            chefNotes: {
                content: data.chefNotes,
                length: data.chefNotes.length,
                isMinimumMet: data.chefNotes.length >= 85,
            },
            timestamp: new Date().toISOString(),
        })

        toast.success('Establishment added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        })

        // Reset form
        reset()
        setUploadedFile(null)
        setSelectedAmenities([])
        setChefNotesValue('')
        setIsLoading(false)
    }, [reset, uploadedFile])

    // Memoized character count message
    const characterCountMessage = useMemo(() => {
        if (chefNotesValue && chefNotesValue.length < 85) {
            return `${85 - chefNotesValue.length} more characters needed (minimum 85)`
        }
        return null
    }, [chefNotesValue])

    return (
        <>
            <ToastContainer position="top-right" />

            <section className="md:pb-44 md:pt-20 py-10">
                <div className="page-width w-full">
                    <h1 className="title md:pb-11 pb-6 text-center">
                        Add an <span className="text-[#FF8400]">Establishment</span>
                    </h1>

                    <form
                        className="border-3 rounded-[9px] border-black md:px-10! md:py-12! py-8! px-4! page-width-narrow"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="">Restaurant Name*</label>
                                <input
                                    type="text"
                                    className={`input-field transition-colors ${errors.restaurantName ? 'border-red-500' : ''}`}
                                    {...register('restaurantName')}
                                    disabled={isLoading}
                                />
                                {errors.restaurantName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.restaurantName.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Cuisine*'
                                        className={`input-field ${errors.cuisine ? 'border-red-500' : ''}`}
                                        {...register('cuisine')}
                                        disabled={isLoading}
                                    />
                                    {errors.cuisine && (
                                        <p className="text-red-500 text-sm mt-1">{errors.cuisine.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder='(555) 555-5555'
                                        className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                                        {...register('phone')}
                                        disabled={isLoading}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="">Website URL</label>
                                    <input
                                        type="url"
                                        className="input-field"
                                        {...register('websiteUrl')}
                                        disabled={isLoading}
                                    />
                                    {errors.websiteUrl && (
                                        <p className="text-red-500 text-sm mt-1">{errors.websiteUrl.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="">Link to Menu</label>
                                    <input
                                        type="url"
                                        className="input-field"
                                        {...register('linkToMenu')}
                                        disabled={isLoading}
                                    />
                                    {errors.linkToMenu && (
                                        <p className="text-red-500 text-sm mt-1">{errors.linkToMenu.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="mt-10">
                            <label >Restaurant Address*</label>
                            <div className="space-y-6 mt-8">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Address Line 1"
                                        className={`input-field ${errors.addressLine1 ? 'border-red-500' : ''}`}
                                        {...register('addressLine1')}
                                        disabled={isLoading}
                                    />
                                    {errors.addressLine1 && (
                                        <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address Line 2"
                                    className="input-field"
                                    {...register('addressLine2')}
                                    disabled={isLoading}
                                />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                                            {...register('city')}
                                            disabled={isLoading}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="State"
                                            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                                            {...register('state')}
                                            disabled={isLoading}
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Zip Code"
                                            className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                                            {...register('zipCode')}
                                            disabled={isLoading}
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            className={`input-field ${errors.country ? 'border-red-500' : ''}`}
                                            {...register('country')}
                                            disabled={isLoading}
                                        />
                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="mt-10 ">
                            <label className="block">
                                Upload Logo or Featured Image (optional)
                            </label>
                            <label className={`block mt-8 border border-dashed md:py-26 md:px-12 px-4 py-10 text-center cursor-pointer bg-transparent transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isLoading}
                                />
                                <p className="text-[20px] font-normal text-black/50 max-sm:text-[16px]">
                                    {uploadedFile ? uploadedFile.name : 'Drag & Drop Files, '}
                                    <span className="underline text-black/50">
                                        {uploadedFile ? 'Change File' : 'Choose Files to Upload'}
                                    </span>
                                </p>
                            </label>
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-10">
                            <label className="">Check all that apply:</label>
                            <div className="grid grid-cols-2 gap-y-3 mt-8 max-sm:gap-2">
                                {amenitiesList.map((item, idx) => (
                                    <label key={idx} className={`flex items-center md:space-x-3 space-x-2 cursor-pointer group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color"
                                            checked={selectedAmenities.includes(item)}
                                            onChange={() => handleAmenityChange(item)}
                                            disabled={isLoading}
                                        />
                                        <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Chef's Notes Section */}
                        <div className="mt-10">
                            <h2 className="md:text-4xl sm:text:3xl text-2xl font-bold mb-2 tracking-[-8%]">
                                {`Share your Chef's Notes...`}
                            </h2>
                            <p className="md:text-[20px] text-[18px] mb-4 tracking-[-8%]">
                                {`  Don't forget to tell us about...`}
                            </p>

                            <div className="flex gap-2 mb-4.5 max-md:flex-wrap">
                                {['your favorite dishes', 'the experience', 'the ambiance'].map((tag) => (
                                    <span key={tag} className="bg-black py-3 px-3 rounded-[6px] text-center md:basis-1/3 md:text-[20px] sm:text-[16px] text-[14px] font-medium text-[#FFF1E1]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    className={`border border-black md:h-96 h-44 p-4 input-field ${errors.chefNotes ? 'border-red-500' : ''}`}
                                    {...register('chefNotes')}
                                    disabled={isLoading}
                                />
                                {!chefNotesValue && !isLoading && (
                                    <span className="pointer-events-none absolute md:bottom-6 md:left-10 bottom-2.5 left-2.5 md:text-[20px] sm:text-[16px] text-[14px] text-black/60">
                                        Positive reviews only. Must be a minimum of 85 characters.
                                    </span>
                                )}
                                {errors.chefNotes && (
                                    <p className="text-red-500 text-sm mt-1">{errors.chefNotes.message}</p>
                                )}
                                {characterCountMessage && !isLoading && (
                                    <p className="text-orange-500 text-sm mt-1">
                                        {characterCountMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button with Loader */}
                        <div className="md:py-8 py-6 flex justify-center">
                            <Button
                                title={isLoading ? 'POSTING REVIEW...' : 'Post Review'}
                                type='submit'
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default AddListing