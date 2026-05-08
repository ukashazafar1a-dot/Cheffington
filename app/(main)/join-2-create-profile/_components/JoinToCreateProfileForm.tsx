'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Button from '@/components/Button'
import WelcomePopup from './WelcomePopup'

// Zod Schema for validation
const profileFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phone: z.string().optional(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    verifyPassword: z.string().min(1, 'Please verify your password'),
    currentRestaurant: z.string().min(1, 'Current restaurant is required'),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    jobTitle: z.string().min(1, 'Job title is required'),
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Please select a country'),
    professionalEmail: z.string().email('Invalid professional email').min(1, 'Professional email is required'),
    fileUpload: z.any().optional(),
    declaration: z.boolean().refine(val => val === true, {
        message: 'You must agree to the declaration'
    }),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and agreement'
    }),
    signature: z.string().optional(),
    printFirstName: z.string().min(1, 'Print first name is required'),
    printLastName: z.string().min(1, 'Print last name is required'),
}).refine((data) => data.password === data.verifyPassword, {
    message: "Passwords don't match",
    path: ["verifyPassword"],
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const JoinToCreateProfileForm = () => {
    const router = useRouter()
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            verifyPassword: '',
            currentRestaurant: '',
            website: '',
            jobTitle: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            professionalEmail: '',
            declaration: false,
            termsAccepted: false,
            printFirstName: '',
            printLastName: '',
        }
    })

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false)
                router.push('/')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [showPopup, router])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] || null
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB')
                return
            }
            setUploadedFile(file)
            setValue('fileUpload', file)
        }
    }

    const onSubmit = async (data: ProfileFormData): Promise<void> => {
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('qasim', data)

        // // Single console object with all form data
        // console.log('📝 Form Submission Data:', {
        //   personalInfo: {
        //     firstName: data.firstName,
        //     lastName: data.lastName,
        //     fullName: `${data.firstName} ${data.lastName}`,
        //     email: data.email,
        //     phone: data.phone || 'Not provided',
        //   },
        //   credentials: {
        //     password: '••••••••',
        //     passwordLength: data.password.length,
        //   },
        //   professionalInfo: {
        //     currentRestaurant: data.currentRestaurant,
        //     website: data.website || 'Not provided',
        //     jobTitle: data.jobTitle,
        //     professionalEmail: data.professionalEmail,
        //   },
        //   address: {
        //     line1: data.addressLine1,
        //     line2: data.addressLine2 || 'Not provided',
        //     city: data.city,
        //     state: data.state,
        //     zipCode: data.zipCode,
        //     country: data.country,
        //     fullAddress: `${data.addressLine1}, ${data.city}, ${data.state} ${data.zipCode}, ${data.country}`,
        //   },
        //   fileUpload: uploadedFile ? {
        //     name: uploadedFile.name,
        //     size: `${(uploadedFile.size / 1024).toFixed(2)} KB`,
        //     type: uploadedFile.type,
        //   } : 'No file uploaded',
        //   legal: {
        //     declaration: data.declaration ? 'Agreed' : 'Not agreed',
        //     termsAccepted: data.termsAccepted ? 'Accepted' : 'Not accepted',
        //   },
        //   printName: {
        //     firstName: data.printFirstName,
        //     lastName: data.printLastName,
        //     fullName: `${data.printFirstName} ${data.printLastName}`,
        //   },
        //   timestamp: new Date().toISOString(),
        // })

        toast.success('Profile created successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        })

        setIsLoading(false)
        reset()
        setUploadedFile(null)

        setTimeout(() => {
            setShowPopup(true)
        }, 500)
    }

    const handleClosePopup = (): void => {
        setShowPopup(false)
        router.push('/')
    }

    const handleContactClick = (): void => {
        setShowPopup(false)
        router.push('/contact')
    }

    const hasFieldError = (fieldName: keyof ProfileFormData): boolean => {
        return !!errors[fieldName]
    }

    const getFieldError = (fieldName: keyof ProfileFormData): string | undefined => {
        const error = errors[fieldName]
        return error?.message as string | undefined
    }

    return (
        <>
            <ToastContainer position="top-right" />
            <section className="md:pb-44 md:pt-20 py-10">
                <div className="page-width w-full">
                    <div className='mb-12'>
                        <h1 className="title text-center mb-1.5">
                            Be a <span className="text-[#FF8400]">Cheffington</span>
                        </h1>
                        <h2 className="subtitle text-center mb-8 ">
                            Create Your Profile
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="border-3 rounded-[9px] border-black md:px-10! md:py-12! py-8! px-4! page-width-narrow"
                        noValidate
                    >
                        {/* Full Name */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="First"
                                        className={`input-field ${hasFieldError('firstName') ? 'border-red-500' : ''}`}
                                        {...register('firstName')}
                                    />
                                    {getFieldError('firstName') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('firstName')}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Last"
                                        className={`input-field ${hasFieldError('lastName') ? 'border-red-500' : ''}`}
                                        {...register('lastName')}
                                    />
                                    {getFieldError('lastName') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('lastName')}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input-field ${hasFieldError('email') ? 'border-red-500' : ''}`}
                                        {...register('email')}
                                    />
                                    {getFieldError('email') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('email')}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        {...register('phone')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password & Verify */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">
                                        Create Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`input-field ${hasFieldError('password') ? 'border-red-500' : ''}`}
                                        {...register('password')}
                                    />
                                    {getFieldError('password') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('password')}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">
                                        Verify Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`input-field ${hasFieldError('verifyPassword') ? 'border-red-500' : ''}`}
                                        {...register('verifyPassword')}
                                    />
                                    {getFieldError('verifyPassword') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('verifyPassword')}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Current Restaurant & Website */}
                        <div className="mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">
                                        Current Restaurant <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`input-field ${hasFieldError('currentRestaurant') ? 'border-red-500' : ''}`}
                                        {...register('currentRestaurant')}
                                    />
                                    {getFieldError('currentRestaurant') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('currentRestaurant')}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-lg font-medium!">Website (Optional)</label>
                                    <input
                                        type="url"
                                        className="input-field"
                                        {...register('website')}
                                    />
                                    {getFieldError('website') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('website')}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Job Title */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`input-field ${hasFieldError('jobTitle') ? 'border-red-500' : ''}`}
                                {...register('jobTitle')}
                            />
                            {getFieldError('jobTitle') && (
                                <p className="text-red-500 text-sm mt-2">{getFieldError('jobTitle')}</p>
                            )}
                        </div>

                        {/* Restaurant Address */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium!">
                                Restaurant Address <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Address Line 1"
                                        className={`input-field ${hasFieldError('addressLine1') ? 'border-red-500' : ''}`}
                                        {...register('addressLine1')}
                                    />
                                    {getFieldError('addressLine1') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('addressLine1')}</p>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address Line 2 (Optional)"
                                    className="input-field"
                                    {...register('addressLine2')}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className={`input-field ${hasFieldError('city') ? 'border-red-500' : ''}`}
                                            {...register('city')}
                                        />
                                        {getFieldError('city') && (
                                            <p className="text-red-500 text-sm mt-2">{getFieldError('city')}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="State"
                                            className={`input-field ${hasFieldError('state') ? 'border-red-500' : ''}`}
                                            {...register('state')}
                                        />
                                        {getFieldError('state') && (
                                            <p className="text-red-500 text-sm mt-2">{getFieldError('state')}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Zip Code"
                                            className={`input-field ${hasFieldError('zipCode') ? 'border-red-500' : ''}`}
                                            {...register('zipCode')}
                                        />
                                        {getFieldError('zipCode') && (
                                            <p className="text-red-500 text-sm mt-2">{getFieldError('zipCode')}</p>
                                        )}
                                    </div>
                                    <div>
                                        <select
                                            className={`input-field ${hasFieldError('country') ? 'border-red-500' : ''}`}
                                            {...register('country')}
                                        >
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        {getFieldError('country') && (
                                            <p className="text-red-500 text-sm mt-2">{getFieldError('country')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Qualification Section */}
                        <div className="mb-10">
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mb-4">
                                To qualify as a Cheffington, you must enter a valid restaurant email (ex. may be submitted from any of our global locations).
                            </p>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Professional email"
                                    className={`input-field ${hasFieldError('professionalEmail') ? 'border-red-500' : ''}`}
                                    {...register('professionalEmail')}
                                />
                                {getFieldError('professionalEmail') && (
                                    <p className="text-red-500 text-sm mt-2">{getFieldError('professionalEmail')}</p>
                                )}
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className='mb-10'>
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mb-4">Phone optional — restaurant may take up to part of employment</p>

                            <label className="block border border-dashed border-black/50 md:py-20 md:px-12 px-4 py-10 text-center cursor-pointer bg-transparent rounded-lg hover:bg-gray-50 transition-colors">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <p className="md:text-[20px] text-[18px] font-normal text-black/50 max-sm:text-[16px]">
                                    {uploadedFile ? uploadedFile.name : 'Drag & Drop Files, '}
                                    <span className="underline text-black/50">
                                        {uploadedFile ? 'Change File' : 'Choose Files to Upload'}
                                    </span>
                                </p>
                            </label>
                            <p className="md:text-[20px] text-[18px] tracking-[-8%] leading-normal mt-2 mb-4">Must be dated in the last six months</p>
                        </div>

                        {/* Declaration */}
                        <div className="mb-10">
                            <div className="text-[20px] leading-normal tracking-[-8%] mb-2 text-lg font-bold">Declaration</div>
                            <label className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color"
                                    {...register('declaration')}
                                />
                                <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">
                                    Information submitted without above is consent to the best of my knowledge.
                                </span>
                            </label>
                            {getFieldError('declaration') && (
                                <p className="text-red-500 text-sm mt-2">{getFieldError('declaration')}</p>
                            )}
                        </div>

                        {/* Signature */}
                        <div className="mb-10">
                            <label className="block mb-2 text-lg font-medium">Signature</label>
                            <div className="border border-black h-36 bg-transparent" />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="mb-10">
                            <label className="flex items-center md:space-x-3 space-x-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="md:min-w-10 md:min-h-10 min-w-5 min-h-5 border border-black bg-transparent rounded-none checked:border-black cursor-pointer accent-color"
                                    {...register('termsAccepted')}
                                />
                                <span className="md:text-[20px] text-[16px] tracking-[-8%] font-medium">
                                    I have read and accept the <span className='underline'><Link href="/terms">terms and agreement</Link>.</span>
                                </span>
                            </label>
                            {getFieldError('termsAccepted') && (
                                <p className="text-red-500 text-sm mt-2">{getFieldError('termsAccepted')}</p>
                            )}
                        </div>

                        {/* Print Name */}
                        <div className="mb-8">
                            <label className="block mb-2 text-lg font-medium!">
                                Print Name <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="First"
                                        className={`input-field ${hasFieldError('printFirstName') ? 'border-red-500' : ''}`}
                                        {...register('printFirstName')}
                                    />
                                    {getFieldError('printFirstName') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('printFirstName')}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Last"
                                        className={`input-field ${hasFieldError('printLastName') ? 'border-red-500' : ''}`}
                                        {...register('printLastName')}
                                    />
                                    {getFieldError('printLastName') && (
                                        <p className="text-red-500 text-sm mt-2">{getFieldError('printLastName')}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:py-8 py-6 flex justify-center">
                            <Button
                                type='submit'
                                title={isLoading ? 'CREATING PROFILE...' : 'CREATE PROFILE'}
                                disabled={isLoading}
                                className={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                            />
                        </div>
                    </form>
                </div>
            </section>

            {showPopup && (
                <WelcomePopup
                    onClose={handleClosePopup}
                    onContactClick={handleContactClick}
                    autoHideDelay={5000}
                />
            )}
        </>
    )
}

export default JoinToCreateProfileForm