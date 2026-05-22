"use client";

import { sitedata } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const navLinks = [
    { name: "JOIN", url: "join" },
    { name: "ABOUT", url: "about" },
    { name: "REVIEW", url: "review" },
    { name: "RESTAURANTS", url: "restaurants" },
    { name: "ADD LISTING", url: "add-listing" },
    { name: "CLAIM RESTAURANT", url: "claim-a-restaurant" },
    { name: "ADVERTISE", url: "advertising" },
  ];

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("chefToken");

    if (token) {
      setIsLoggedIn(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chefToken");
    localStorage.removeItem("chefName");

    setIsLoggedIn(false);
    setProfileOpen(false);

    router.push("/sign-in");
  };

  return (
    <div className="relative">
      <nav className="sticky top-0 z-50 w-full lg:px-8 px-4 flex items-center lg:py-4 py-2 body-subtitle justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1">
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

          {/* Auth Section */}
          <li className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="cursor-pointer"
                >
                  <Image
                    src="/Layer.png"
                    alt="Profile"
                    width={28}
                    height={28}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white shadow-lg border rounded-lg overflow-hidden z-50">
                    <Link
                      href="/individual-chef-page"
                      className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/sign-in">
                <Image
                  src="/Layer.png"
                  alt="Profile"
                  width={28}
                  height={28}
                />
              </Link>
            )}
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
                    className="text-sm w-full"
                  >
                    {item.name}
                  </a>
                </li>
              ))}

              {/* Mobile Auth */}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/individual-chef-page"
                      onClick={() => setOpen(false)}
                      className="text-sm"
                    >
                      My Profile
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    <Image
                      src="/Layer.png"
                      alt="Profile"
                      width={28}
                      height={28}
                    />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}