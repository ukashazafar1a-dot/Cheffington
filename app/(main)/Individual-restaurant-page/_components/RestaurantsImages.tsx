"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import IconPrev from "@/components/Icons/IconPrev";

type RestaurantsImagesProps = {
    images?: string[];
    /** Tighter carousel for public restaurant hero */
    compact?: boolean;
};
const DUMMY_IMAGES = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop",
];

const RestaurantsImages = ({ images = DUMMY_IMAGES, compact = false }: RestaurantsImagesProps) => {
    const slideClass = compact
        ? "relative w-52 h-52 sm:w-56 sm:h-56 max-w-full overflow-hidden rounded-md"
        : "relative w-64.25 h-64.25 max-w-full max-sm:h-48 max-sm:w-full overflow-hidden rounded-md";
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={8}
                slidesPerView={2}
                speed={500}
                onSwiper={(swiper: SwiperType) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper: SwiperType) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                breakpoints={{
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                    },
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <div className={slideClass}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={image}
                                    alt={`Restaurant Image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Your original Slider Buttons - kept exactly the same */}
            {images.length > 3 && (
                <div className="flex items-center gap-4 mt-4">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        disabled={isBeginning}
                        className="w-8 h-8 flex items-center pointer-coarse justify-center absolute top-1/2 left-2 bg-[#ff8a00] rounded-full z-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <IconPrev />
                    </button>

                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        disabled={isEnd}
                        className="w-8 h-8 flex items-center pointer-coarse justify-center absolute top-1/2 right-4 max-sm:right-8! bg-[#ff8a00] rounded-full z-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <IconPrev class="rotate-180" />
                    </button>
                </div>
            )}
            {/* <style jsx global>{`
        .swiper-slide {
          width: auto !important;
          max-width:auto !important;
        }
        
        @media (max-width: 1279px) {
          .swiper-slide {
            width: 100% !important;
            max-width:100% !important;
          }
          
          .swiper-slide .relative {
            width: 100% !important;
            max-width:100% !important;
          }
        }
      `}</style> */}
        </div>
    );
};

export default RestaurantsImages;