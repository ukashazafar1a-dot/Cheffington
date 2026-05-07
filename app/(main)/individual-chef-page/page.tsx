"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import Map from "@/components/Map";
import ReviewItem from "./_components/page";

export default function ChefProfile() {
  return (
    <div className="w-full">

      {/* HEADER */}
      <header className="bg-black text-white pt-10 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex flex-col md:flex-row gap-6 md:items-center">

            <div className="flex items-center gap-4 md:gap-6">

              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full border-4 border-white" />

              <div>
                <h1 className="text-3xl md:text-5xl font-bold">
                  Jane Austen
                </h1>
                <p className="text-gray-300 text-sm md:text-xl">
                  Title / Restaurant Name
                </p>
              </div>

            </div>

            <button className="bg-[#FF8C00] text-black font-bold px-5 py-2 text-sm uppercase rounded-sm w-fit">
              22 Chef Reviews
            </button>

          </div>

          <div className="mt-6 flex gap-3">
            <button className="bg-[#FF8C00] text-black font-bold px-6 py-2 text-sm rounded-sm">
              WEBSITE
            </button>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-8">

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Chef Notes
            </h2>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 mb-8">

              <button className="bg-[#FF8C00] px-5 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                Sort by <ChevronDown size={16} />
              </button>

              <button className="bg-[#FF8C00] px-5 py-2 rounded-lg font-bold text-sm">
                Near me
              </button>

              <button className="bg-[#FF8C00] px-5 py-2 rounded-lg font-bold text-sm">
                More filters
              </button>

            </div>

            {/* REVIEWS */}
           <div className="border-2 border-black rounded-3xl p-4 md:p-8 space-y-8">

              {[1, 2, 3, 4, 5].map((i) => (
                <ReviewItem key={i} />
              ))}
 
            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* MAP */}
            <div className="w-full h-[320px] md:h-[447px] rounded overflow-hidden border">
              <Map lat={30.2672} lng={-97.7431} name="Chef Location" />
            </div>
             
            

            {/* INFO */}
            <div className="bg-[#FF8C00] text-center p-4 rounded text-black font-bold text-sm">
              123 Fake Street, Austin, TX 12345
              <div className="text-blue-700 underline text-xs mt-1">
                Get Directions
              </div>
            </div>

            <div className="bg-[#FF8C00] text-center p-3 rounded font-bold text-black text-sm">
              (555) 555-5555
            </div>

            <div className="bg-[#FF8C00] text-center p-3 rounded font-bold text-black text-sm">
              www.website.com
            </div>

            {/* AD BOX */}
            <div className="bg-gray-300 h-[250px] md:h-[500px] rounded flex items-center justify-center">
              <div className="text-gray-700 text-sm">
                Ad / Placeholder
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}