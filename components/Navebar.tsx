"use client";

import { sitedata } from "@/data/site";
import { getChefMe } from "@/lib/api-client";
import {
  formatAccountRoleLabel,
  type ChefProfile,
} from "@/types/chef";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ChefNavSession = {
  name: string;
  profilePhotoUrl?: string;
  roleLabel?: string;
  applicationType?: ChefProfile["applicationType"];
};

function chefNameFromStorage() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("chefName")?.trim() || "";
}

function roleFromStorage() {
  if (typeof window === "undefined") return "";
  return formatAccountRoleLabel(
    window.localStorage.getItem("chefApplicationType")
  );
}

function chefInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ChefNavAvatar({
  name,
  profilePhotoUrl,
  sizeClass = "h-10 w-10 lg:h-12 lg:w-12",
  subtle = false,
}: {
  name: string;
  profilePhotoUrl?: string;
  sizeClass?: string;
  subtle?: boolean;
}) {
  const borderClass = subtle ? "border border-black/10" : "border-2 border-black/10";

  if (profilePhotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profilePhotoUrl}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${borderClass}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-[#FFF1E1] text-xs font-medium text-[#FF8400] ${borderClass} ${subtle ? "" : "text-base font-black lg:text-lg"}`}
    >
      {chefInitials(name) || "?"}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();

  const allNavLinks = [
    { name: "JOIN", url: "/join", chefsOnly: false },
    { name: "ABOUT", url: "/about", chefsOnly: false },
    { name: "REVIEW", url: "/review", chefsOnly: true },
    { name: "RESTAURANTS", url: "/restaurants", chefsOnly: false },
    { name: "CLAIM RESTAURANT", url: "/claim-a-restaurant", chefsOnly: false },
    { name: "ADVERTISE", url: "/advertising", chefsOnly: false },
  ];

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chefSession, setChefSession] = useState<ChefNavSession | null>(null);

  const isChefAccount = chefSession?.applicationType !== "business_owner";
  const navLinks = isLoggedIn
    ? allNavLinks.filter((item) => (item.chefsOnly ? isChefAccount : true))
    : allNavLinks.filter((item) => !item.chefsOnly);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadChefSession = useCallback(async () => {
    const token = window.localStorage.getItem("chefToken");
    if (!token) {
      setIsLoggedIn(false);
      setChefSession(null);
      return;
    }

    setIsLoggedIn(true);

    const fallbackName = chefNameFromStorage() || "Chef";
    const fallbackRole = roleFromStorage() || "Chef";
    setChefSession((prev) => ({
      name: prev?.name || fallbackName,
      profilePhotoUrl: prev?.profilePhotoUrl,
      roleLabel: prev?.roleLabel || fallbackRole,
      applicationType: prev?.applicationType,
    }));

    try {
      const chef = await getChefMe(token);
      const name =
        `${chef?.firstName ?? ""} ${chef?.lastName ?? ""}`.trim() || fallbackName;
      const applicationType = chef?.applicationType || "chef";
      const roleLabel = formatAccountRoleLabel(applicationType);
      if (name) {
        window.localStorage.setItem("chefName", name);
      }
      window.localStorage.setItem("chefApplicationType", applicationType);
      setChefSession({
        name,
        profilePhotoUrl: chef?.profilePhotoUrl,
        roleLabel,
        applicationType,
      });
    } catch {
      setChefSession({ name: fallbackName, roleLabel: fallbackRole });
    }
  }, []);

  useEffect(() => {
    loadChefSession();

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<ChefNavSession>).detail;
      if (detail?.name) {
        if (detail.applicationType) {
          window.localStorage.setItem(
            "chefApplicationType",
            detail.applicationType
          );
        }
        setChefSession({
          name: detail.name,
          profilePhotoUrl: detail.profilePhotoUrl,
          roleLabel:
            detail.roleLabel ||
            formatAccountRoleLabel(detail.applicationType) ||
            roleFromStorage(),
          applicationType: detail.applicationType,
        });
        setIsLoggedIn(true);
        return;
      }
      loadChefSession();
    };

    const handleStorage = () => {
      loadChefSession();
    };

    window.addEventListener("chef-profile-updated", handleProfileUpdated);
    window.addEventListener("storage", handleStorage);

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
      window.removeEventListener("chef-profile-updated", handleProfileUpdated);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loadChefSession]);

  const handleLogout = () => {
    localStorage.removeItem("chefToken");
    localStorage.removeItem("chefName");
    localStorage.removeItem("chefApplicationType");

    setIsLoggedIn(false);
    setChefSession(null);
    setProfileOpen(false);

    router.push("/sign-in");
  };

  const chefDisplayName = chefSession?.name || "Chef";
  const roleLabel = chefSession?.roleLabel || "Chef";

  const desktopAuth = (
    <div className="relative z-[1200] shrink-0" ref={dropdownRef}>
      {isLoggedIn ? (
        <>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex max-w-[11rem] cursor-pointer items-center gap-2 rounded-full py-1 pl-0.5 pr-2 transition hover:bg-black/5 xl:max-w-[13rem]"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <ChefNavAvatar
              name={chefDisplayName}
              profilePhotoUrl={chefSession?.profilePhotoUrl}
              sizeClass="h-8 w-8"
              subtle
            />
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-normal normal-case text-black/75">
                {chefDisplayName}
              </span>
              <span className="block truncate text-[11px] font-medium normal-case text-black/45">
                {roleLabel}
              </span>
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-[1300] mt-2 w-52 overflow-hidden rounded-lg border-2 border-black bg-white shadow-lg shadow-black/20">
              <div className="border-b border-black/10 px-5 py-3">
                <p className="truncate text-sm font-semibold text-black">
                  {chefDisplayName}
                </p>
                <p className="text-xs font-medium text-[#FF8400]">{roleLabel}</p>
              </div>
              <Link
                href="/individual-chef-page"
                className="block px-5 py-3.5 text-base font-bold transition hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full px-5 py-3.5 text-left text-base font-bold text-red-600 transition hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <Link href="/sign-in" className="inline-flex p-1 opacity-80">
          <Image
            src="/Layer.png"
            alt="Profile"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </Link>
      )}
    </div>
  );

  return (
    <div className="relative z-[1100]">
      <nav className="sticky top-0 z-[1100] grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 border-b-2 border-black/10 bg-[var(--bg)] px-4 py-4 lg:px-6 lg:py-5 xl:px-8">
        {/* Logo — full brand name, no truncation */}
        <div className="z-10 shrink-0 justify-self-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={sitedata?.logo}
              alt="Chicken Chef"
              width={64}
              height={48}
              priority
              className="h-10 w-auto shrink-0 object-contain sm:h-11 lg:h-12 xl:h-14"
            />

            <span className="hidden whitespace-nowrap font-black leading-none tracking-tight sm:inline sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
              Cheffington
            </span>
          </Link>
        </div>

        {/* Desktop: links + profile grouped at the right end */}
        <div className="hidden min-w-0 items-center justify-end gap-3 lg:flex xl:gap-4">
          <ul className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 xl:gap-x-5">
            {navLinks.map((item) => (
              <li key={item.url} className="shrink-0">
                <Link
                  className="body-subtitle whitespace-nowrap text-lg font-bold uppercase tracking-tight transition hover:text-black/60 lg:text-xl xl:text-2xl"
                  href={item.url}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-1 shrink-0 border-l border-black/15 pl-3 xl:ml-2 xl:pl-4">
            {desktopAuth}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="menu-btn"
          className="shrink-0 justify-self-end active:scale-90 transition lg:hidden"
        >
          {open ? (
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="38" height="38" viewBox="0 0 30 30" fill="none">
              <path
                d="M3 7h24M3 14h24M3 21h24"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute left-0 top-full z-40 w-full border-b-2 border-black/10 bg-[var(--bg)] p-8 shadow-lg lg:hidden">
            <ul className="flex flex-col space-y-7">
              {navLinks.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="block w-full text-2xl font-black uppercase tracking-tight"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Mobile Auth */}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/individual-chef-page"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4"
                    >
                      <ChefNavAvatar
                        name={chefDisplayName}
                        profilePhotoUrl={chefSession?.profilePhotoUrl}
                        sizeClass="h-14 w-14"
                      />
                      <span className="min-w-0">
                        <span className="block text-base font-normal normal-case text-black/75">
                          {chefDisplayName}
                        </span>
                        <span className="block text-sm font-medium normal-case text-[#FF8400]">
                          {roleLabel}
                        </span>
                      </span>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-xl font-black text-red-600"
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
                      width={40}
                      height={40}
                      className="h-10 w-10"
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