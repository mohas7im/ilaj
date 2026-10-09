"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api/errors";
import Button from "@/components/website/ui/Button";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Input from "@/components/website/ui/Input";
import Select from "@/components/website/ui/Select";
import Textarea from "@/components/website/ui/Textarea";
import { submitContactInquiry } from "../_api/contactApi";

type Status = "idle" | "submitting" | "error";
type Sent = { firstName: string };

const TREATMENTS = [
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Orthodontics",
  "Root Canal Treatment",
  "Other",
];

// General enquiry form (bookings go through the appointment modal).
// Client-side validation schema — mirrors the server schema but with
// user-friendly messages for each field.
const formSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters and spaces"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-().]{7,15}$/, "Enter a valid phone number"),
  email: z.union([z.literal(""), z.string().email("Enter a valid email address")]),
  treatment: z.string(),
  message: z.string().min(1, "Please enter your message"),
});

type FormFields = z.infer<typeof formSchema>;
type FieldErrors = Partial<Record<keyof FormFields, string>>;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<Sent | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The submit button grows into the confirmation panel: the panel is clipped
  // to the button's exact box and pill shape, then opens out to fill the card.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const button = buttonRef.current;
    if (!sent || !panel || !button) return;
    headingRef.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const p = panel.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    panel.animate(
      [
        { clipPath: `inset(${b.top - p.top}px ${p.right - b.right}px ${p.bottom - b.bottom}px ${b.left - p.left}px round 999px)` },
        { clipPath: "inset(0 round 1rem)" },
      ],
      { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const fields = new FormData(formElement);
    const value = (name: string) => String(fields.get(name) ?? "").trim();

    const raw = {
      fullName: value("fullName"),
      phone: value("phone"),
      email: value("email"),
      treatment: value("treatment"),
      message: value("message"),
    };

    // Validate on the client before hitting the API
    const result = formSchema.safeParse(raw);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormFields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    // Clear previous errors and submit
    setFieldErrors({});
    setStatus("submitting");

    try {
      await submitContactInquiry({
        fullName: result.data.fullName,
        phone: result.data.phone,
        email: result.data.email,
        treatment: result.data.treatment,
        preferredDate: "",
        preferredTime: "",
        message: result.data.message,
        type: "inquiry",
      });
      formElement.reset();
      const firstName = result.data.fullName.split(/\s+/)[0];
      setSent({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      });
      setStatus("idle");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Could not send your message. Please try again or call us."));
      setStatus("error");
    }
  };

  // Clear a single field error as soon as the user starts correcting it
  const clearError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
    <form className="mt-5 sm:mt-3" onSubmit={handleSubmit} noValidate inert={sent !== null}>

      <div className="grid grid-cols-1 gap-x-3.5 gap-y-4 sm:grid-cols-2">

        <Input
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name *"
          placeholder="Enter Your Full Name"
          error={fieldErrors.fullName}
          onChange={() => clearError("fullName")}
        />

        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number *"
          placeholder="Enter your phone number"
          error={fieldErrors.phone}
          onChange={() => clearError("phone")}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          error={fieldErrors.email}
          onChange={() => clearError("email")}
        />

        <Select
          id="treatment"
          name="treatment"
          label="Related Treatment (Optional)"
          placeholder="Choose a treatment"
          options={TREATMENTS}
          error={fieldErrors.treatment}
        />

        <Textarea
          id="message"
          name="message"
          label="Your Message *"
          placeholder="How can we help you?"
          className="sm:col-span-2"
          error={fieldErrors.message}
          onChange={() => clearError("message")}
        />

      </div>

      <Button
        ref={buttonRef}
        type="submit"
        variant="primary"
        showIcon={false}
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="mt-8 w-full"
      >
        {/* While sending, the label stays in place (invisible) so the button keeps its size */}
        <span className="relative inline-flex items-center justify-center">
          <span className={status === "submitting" ? "invisible" : undefined}>Send Message</span>
          {status === "submitting" && (
            <>
              <LoaderCircle aria-hidden="true" className="absolute size-5 animate-spin" />
              <span className="sr-only">Sending…</span>
            </>
          )}
        </span>
      </Button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {apiError}
        </p>
      )}

    </form>

    {/* Confirmation — covers the whole card (the card is position: relative) */}
    {sent && (
      <div
        ref={panelRef}
        className="absolute -inset-px z-10 flex flex-col items-start justify-end rounded-2xl bg-brand p-6 sm:p-10"
      >
        <div className="hero-fade" style={{ "--delay": "0.45s" } as React.CSSProperties}>
          <SectionTitle as="h3" tone="light">
            <span ref={headingRef} tabIndex={-1} className="outline-none">
              Thanks, {sent.firstName}.
            </span>
          </SectionTitle>
          <SectionDescription tone="light" className="mt-3 max-w-md">
            Your message has been sent. Our team will get back to you shortly.
          </SectionDescription>
          <Button
            variant="secondary"
            onClick={() => {
              setSent(null);
              requestAnimationFrame(() => document.getElementById("fullName")?.focus());
            }}
            className="mt-8"
          >
            Send another message
          </Button>
        </div>
      </div>
    )}
    </>
  );
}
