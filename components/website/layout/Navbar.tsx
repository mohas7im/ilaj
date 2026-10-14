"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/website/ui/Button";
import AppointmentModal from "@/components/website/appointment/AppointmentModal";
import { BRAND_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Smile Gallery", href: "/smile-gallery" },
  { name: "Treatments", href: "/treatments" },
  { name: "Contact", href: "/contact" },
];

/**
 * Global helper to trigger the appointment modal from any client component.
 */
export function openAppointmentModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-appointment-modal"));
  }
}

export interface NavbarProps {
  clinicName: string;
  clinicPhone?: string;
}

export default function Navbar({ clinicName, clinicPhone }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Allow other components to trigger the appointment modal via window event
  useEffect(() => {
    const handleOpen = () => setAppointmentModalOpen(true);
    window.addEventListener("open-appointment-modal", handleOpen);
    return () => window.removeEventListener("open-appointment-modal", handleOpen);
  }, []);

  // Transparent with white text only over the dark home hero; every other page
  // (and the home page once scrolled) uses the solid, dark-text style.
  const solid = scrolled || pathname !== "/";

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          solid
            ? "bg-white shadow-sm border-b border-zinc-200"
            : "bg-transparent border-b border-gray-300",
          // Open mobile menu: bar + drawer share one background so they read as one panel
          mobileOpen && !solid && "bg-neutral-950/95 backdrop-blur-md border-white/10 md:bg-transparent md:backdrop-blur-none md:border-gray-300"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0"
              aria-label={clinicName ? `${clinicName} — Home` : "Home"}
            >
              <Image
                src={solid ? BRAND_LOGO.full : BRAND_LOGO.light}
                alt={clinicName}
                width={BRAND_LOGO.width}
                height={BRAND_LOGO.height}
                preload
                className="h-12 w-auto"
              />
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
              <Button
                variant="primary"
                onClick={() => setAppointmentModalOpen(true)}
              >
                Book Appointment
              </Button>
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
          <div className="md:hidden px-6 pt-3 pb-8 space-y-5">
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
              <Button
                variant="primary"
                // Full width: label on the left, arrow pinned to the right edge
                className="w-full flex-row-reverse justify-between pl-6 pr-2 py-2 text-base"
                onClick={() => {
                  setMobileOpen(false);
                  setAppointmentModalOpen(true);
                }}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        clinicPhone={clinicPhone}
      />
    </>
  );
}
