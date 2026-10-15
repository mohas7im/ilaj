"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * Accessible, animated modal dialog.
 * Renders into document.body using a React portal.
 * Locks background scrolling, isolates Lenis smooth scroll,
 * and manages keyboard interactions (Escape key).
 */
export function Modal({
  isOpen,
  onClose,
  children,
  className,
  cardClassName,
  showCloseButton = true,
  closeButtonAriaLabel = "Close modal",
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle Escape key: if an inner dropdown/picker is currently expanded,
  // do not close the modal so that the picker can close first.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const hasOpenPicker = cardRef.current?.querySelector('[aria-expanded="true"]');
        if (hasOpenPicker) {
          return;
        }
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="presentation"
          data-lenis-prevent
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto",
            className
          )}
        >
          {/* Backdrop overlay */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            key="modal-card"
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.95,
              y: shouldReduceMotion ? 0 : 14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: shouldReduceMotion ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.96,
              y: shouldReduceMotion ? 0 : 10,
              transition: {
                duration: shouldReduceMotion ? 0 : 0.16,
                ease: "easeIn",
              },
            }}
            className={cn(
              "relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-zinc-200/80 my-auto",
              "max-h-[calc(100dvh-2rem)] sm:max-h-[92vh] overflow-y-auto",
              cardClassName
            )}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label={closeButtonAriaLabel}
                className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-20 flex size-8 sm:size-9 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              >
                <X className="size-4.5 sm:size-5" />
              </button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
