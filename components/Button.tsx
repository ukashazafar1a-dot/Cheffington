"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

type ButtonProps = {
  title: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  title,
  href,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = `
    button button-primary
    flex items-center justify-center gap-2
    ${className}
  `;

  const content = (
    <>
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {loading ? "Loading..." : title}

      {/* {title} */}
    </>
  );

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-disabled={isDisabled}
          onClick={(e) => {
            if (isDisabled) e.preventDefault();
          }}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
        aria-disabled={isDisabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      suppressHydrationWarning
      className={classes}
    >
      {content}
    </button>
  );
}