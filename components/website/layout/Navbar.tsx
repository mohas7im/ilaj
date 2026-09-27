"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/website/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/doctors" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent with white text only over the dark home hero; every other page
  // (and the home page once scrolled) uses the solid, dark-text style.
  const solid = scrolled || pathname !== "/";

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200"
          : "bg-transparent border-b border-gray-300"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Ilaj — Home"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand text-white font-bold text-lg leading-none shadow-sm">
              C
            </span>
            <span
              className={cn(
                "font-bold text-2xl tracking-tight transition-colors duration-200",
                solid ? "text-zinc-950" : "text-white"
              )}
            >
              Ilaj
            </span>
          </Link>

          {/* Desktop Nav Links - Truly Centered */}
          <nav
            className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-base font-medium transition-colors duration-150",
                    solid
                      ? active
                        ? "text-zinc-950 font-semibold"
                        : "text-zinc-600 hover:text-zinc-950"
                      : active
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link href="/appointment">
              <Button variant="primary">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={cn(
              "md:hidden flex items-center justify-center w-11 h-11 rounded-full transition-colors",
              solid
                ? "text-zinc-900 hover:bg-zinc-100"
                : "text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden border-b px-6 pt-3 pb-8 space-y-5 backdrop-blur-md",
            solid
              ? "bg-white/95 border-zinc-200"
              : "bg-neutral-950/95 border-white/10"
          )}
        >
          <div className="flex flex-col space-y-3.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-lg font-medium py-1 transition-colors",
                  solid
                    ? "text-zinc-800 hover:text-zinc-950"
                    : "text-white/85 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Link href="/appointment" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
