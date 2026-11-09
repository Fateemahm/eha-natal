
"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const defaultNavigationLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Contact", href: "/#contact" },
];

export default function Header({
  navigationLinks = defaultNavigationLinks,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { status } = useSession();

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = () => {
    closeMenu();
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="relative z-20 border-b border-[#F0E8EF] bg-[#FFFCF8]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[#684477]"
          aria-label="eha-natal home"
        >
          eha<span className="text-[#E69A86]">-</span>natal
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-8 md:flex">
          {navigationLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-[#655B6B] transition hover:text-[#8B609C]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop authentication buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-[#805B91] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#684477]"
            >
              Sign out
            </button>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#684477] transition hover:bg-[#F5EDF7]"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#805B91] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#684477]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#684477] hover:bg-[#F5EDF7] md:hidden"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#F0E8EF] bg-[#FFFCF8] px-6 py-5 md:hidden"
        >
          <div className="flex flex-col gap-5">
            {navigationLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={closeMenu}
                className="font-medium"
              >
                {label}
              </Link>
            ))}

            <div className="flex gap-3 border-t border-[#F0E8EF] pt-5">
              {status === "authenticated" && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 rounded-full bg-[#805B91] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign out
                </button>
              )}

              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="flex-1 rounded-full border border-[#805B91] px-4 py-3 text-center text-sm font-semibold text-[#684477]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="flex-1 rounded-full bg-[#805B91] px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
