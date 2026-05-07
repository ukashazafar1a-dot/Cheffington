"use client";
import { sitedata } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const navLinks = [
    { name: "JOIN", url: "join" },
    { name: "ABOUT", url: "about" },
    { name: "REVIEW", url: "review" },
    { name: "ADD LISTING", url: "add-listing" },
    { name: "CLAIM RESTAURANT", url: "claim-a-restaurant" },
    { name: "ADVERTISE", url: "advertising" },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="sticky top-0 z-50 w-full lg:px-8 px-4 flex items-center lg:py-4 py-2 body-subtitle justify-between">
        
        <div className="flex items-center gap-1">
          <Link href={"/"} className="flex items-center gap-1">
            <Image
              src={sitedata?.logo}
              alt="Chicken Chef"
              width={80}
              height={60}
              priority
              className="object-center object-cover"
            />
            <span className="font-bold 2xl:text-6xl text-3xl leading-none max-sm:hidden">
              Cheffington
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center xl:gap-10 gap-6">
          {navLinks.map((item, index) => (
            <li key={index}>
              <a
                className="hover:text-gray-500/80 transition leading-[-6%] max-xl:text-[16px]"
                href={item.url}
              >
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <Link href={"/sign-in"}>
              <Image src="/Layer.png" alt="Profile" width={28} height={28} />
            </Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="menu-btn"
          className="lg:hidden ml-auto active:scale-90 transition"
        >
          {open ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M3 7h24M3 14h24M3 21h24"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-[100px] left-0 w-full bg-[var(--bg)] p-6 lg:hidden shadow">
            <ul className="flex flex-col space-y-6 text-lg">
              
              
              {navLinks.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}

        
              <li>
                <Link href={"/sign-in"} onClick={() => setOpen(false)}>
                  <Image
                    src="/Layer.png"
                    alt="Profile"
                    width={28}
                    height={28}
                  />
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}