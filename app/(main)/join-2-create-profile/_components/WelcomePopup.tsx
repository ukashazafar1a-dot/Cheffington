'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';

interface WelcomePopupProps {
    onClose: () => void;
    onContactClick?: () => void;
    title?: string;
    subtitle?: string;
    contactText?: string;
    brandName?: string;
    logoAlt?: string;
    autoHideDelay?: number;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({
    onClose,
    onContactClick,
    title = "Welcome to Cheffington",
    subtitle = "You will receive an email confirming your eligibility shortly.",
    contactText = "Contact us.",
    brandName = "Cheffington",
    logoAlt = "Cheffington Chicken",
    autoHideDelay = 5000
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, autoHideDelay);

        return () => clearTimeout(timer);
    }, [onClose, autoHideDelay]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="relative bg-white rounded-2xl max-w-5xl w-full mx-4 p-8 md:p-12 animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-black transition-colors"
                    aria-label="Close popup"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center">
                    <h1 className="title font-black tracking-tighter text-black mb-8">
                        {title}
                    </h1>

                    <p className="subtitle md:text-4xl font-bold tracking-tight text-black mb-4">
                        {subtitle}
                    </p>

                    <p className="text-sm md:text-base font-medium text-black/70 mb-16">
                        No email?{" "}
                        <button
                            onClick={onContactClick || onClose}
                            className="underline font-bold hover:text-black cursor-pointer transition-colors"
                        >
                            {contactText}
                        </button>
                    </p>

                    <div className="flex flex-col items-center space-y-4 mt-12">
                        <div className="relative w-32 md:w-48 h-auto">
                            <Image
                                src="/image1.png"
                                alt={logoAlt}
                                width={192}
                                height={192}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                        <h2 className="subtitle font-bold!">
                            {brandName}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;