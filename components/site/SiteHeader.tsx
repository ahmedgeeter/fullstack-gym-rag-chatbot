"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/site/SearchBar";
import { buttonClasses } from "@/components/ui/button";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/#collections" },
  { label: "About", href: "/#home" },
  { label: "Shipping & Returns", href: "/#assurance" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#footer" },
];

export const SiteHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Coremont
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden w-full max-w-md lg:block">
          <SearchBar compact />
        </div>
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted hover:text-foreground"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <Link href="/shop?panel=cart" className={buttonClasses("outline", "sm")}>
            Cart
          </Link>
          <Link href="/shop?panel=account" className={buttonClasses("ghost", "sm")}>
            Account
          </Link>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto w-full max-w-6xl px-6 py-4">
            <nav className="flex flex-col gap-4 text-sm text-muted">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4">
              <SearchBar compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
