"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { FieldUnderline, fieldControlClass, fieldLabelClass, fieldLabelErrorClass } from "./Input";

export interface PickerFieldProps {
  id: string;
  label: string;
  /** Form field name; the value is submitted through a hidden input */
  name: string;
  required?: boolean;
  /** Submitted value ("" when empty) */
  value: string;
  /** Text shown in the field; the placeholder shows when empty */
  display?: string;
  placeholder: string;
  icon: React.ReactNode;
  /** Called when the surrounding <form> is reset */
  onReset: () => void;
  popupRole?: "dialog" | "listbox";
  /** Panel width / padding */
  panelClassName?: string;
  /** Panel alignment relative to field: "left" or "right" (default "left") */
  align?: "left" | "right";
  /** Panel open direction: "down" or "up" (default "down") */
  direction?: "down" | "up";
  /** Layout only (e.g. grid span) */
  className?: string;
  error?: string;
  /** Panel content; call `close` after a choice is made */
  children: (close: () => void) => React.ReactNode;
}

/**
 * Shell for the custom form pickers (DatePicker, TimePicker, Select): the same
 * label + underline look as Input, a trigger that opens a panel anywhere you
 * click, and a hidden input so native `required` validation and FormData keep
 * working. Closes on outside click or Escape.
 */
export function PickerField({
  id,
  label,
  name,
  required,
  value,
  display,
  placeholder,
  icon,
  onReset,
  popupRole = "dialog",
  panelClassName,
  align = "left",
  direction = "down",
  className,
  error,
  children,
}: PickerFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onResetRef = useRef(onReset);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    onResetRef.current = onReset;
  });

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        !rootRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Native form.reset() doesn't know about React state, so clear it ourselves
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const handleReset = () => onResetRef.current();
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, []);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Recalculate the panel position whenever it opens
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const MARGIN = 8; // gap between field and panel
    const MAX_PANEL_W = Math.min(360, window.innerWidth - 16);

    let top: number;
    let bottom: string | undefined;
    if (direction === "up") {
      // panel sits above the trigger
      bottom = window.innerHeight - rect.top + MARGIN;
      top = 0; // unused when we set bottom
    } else {
      top = rect.bottom + MARGIN;
    }

    // Horizontal: align to left or right edge of the trigger
    let left = align === "right" ? rect.right - MAX_PANEL_W : rect.left;
    // Clamp so panel never bleeds off the right edge
    left = Math.max(8, Math.min(left, window.innerWidth - MAX_PANEL_W - 8));

    if (direction === "up") {
      setPanelStyle({ position: "fixed", bottom: window.innerHeight - rect.top + MARGIN, left, width: Math.max(rect.width, Math.min(MAX_PANEL_W, window.innerWidth - 16)), maxWidth: MAX_PANEL_W, zIndex: 9999 });
    } else {
      setPanelStyle({ position: "fixed", top, left, width: Math.max(rect.width, Math.min(MAX_PANEL_W, window.innerWidth - 16)), maxWidth: MAX_PANEL_W, zIndex: 9999 });
    }
  }, [open, align, direction]);

  return (
    <div ref={rootRef} className={cn("group relative", className)}>
      <label htmlFor={id} className={error ? fieldLabelErrorClass : fieldLabelClass}>
        {label}
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          aria-haspopup={popupRole}
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={cn(
            fieldControlClass,
            "flex h-10 cursor-pointer items-center justify-between gap-3 text-left",
            !display && "text-zinc-500"
          )}
        >
          <span className="truncate">{display || placeholder}</span>
          <span aria-hidden="true" className={cn("shrink-0 transition-colors", open ? "text-brand" : "text-zinc-500")}>
            {icon}
          </span>
        </button>
        <FieldUnderline hasError={!!error} />

        {/* Carries the value into FormData and native required validation */}
        <input
          ref={inputRef}
          name={name}
          value={value}
          required={required}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {mounted && open && createPortal(
        <div
          ref={panelRef}
          style={panelStyle}
          className={cn(
            "rounded-2xl border border-zinc-200 bg-white shadow-xl animate-in fade-in-0 zoom-in-95",
            panelClassName
          )}
        >
          {children(close)}
        </div>,
        document.body
      )}
    </div>
  );
}

export default PickerField;
