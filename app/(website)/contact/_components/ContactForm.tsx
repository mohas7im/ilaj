"use client";

import { useState } from "react";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api/errors";
import Button from "@/components/website/ui/Button";
import Input from "@/components/website/ui/Input";
import Select from "@/components/website/ui/Select";
import Textarea from "@/components/website/ui/Textarea";
import DatePicker from "@/components/website/ui/DatePicker";
import TimePicker from "@/components/website/ui/TimePicker";
import { submitContactInquiry } from "../_api/contactApi";

type Status = "idle" | "submitting" | "success" | "error";

const TREATMENTS = [
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Orthodontics",
  "Root Canal Treatment",
  "Other",
];

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
  // Everything below is optional — only name and phone are required.
  email: z.union([z.literal(""), z.string().email("Enter a valid email address")]),
  treatment: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  message: z.string(),
});

type FormFields = z.infer<typeof formSchema>;
type FieldErrors = Partial<Record<keyof FormFields, string>>;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
      preferredDate: value("date"),
      preferredTime: value("time"),
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
        preferredDate: result.data.preferredDate,
        preferredTime: result.data.preferredTime,
        message: result.data.message,
      });
      formElement.reset();
      setStatus("success");
    } catch (err) {
      setApiError(getApiErrorMessage(err, "Could not send your request. Please try again or call us."));
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
    <form className="mt-3" onSubmit={handleSubmit} noValidate>

      <div className="grid grid-cols-1 gap-x-3.5 gap-y-4 sm:grid-cols-2">

        <Input
          id="fullName"
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="Enter Your Full Name"
          error={fieldErrors.fullName}
          onChange={() => clearError("fullName")}
        />

        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
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
          label="Select Treatment"
          placeholder="Choose a treatment"
          options={TREATMENTS}
          error={fieldErrors.treatment}
        />

        <DatePicker
          id="date"
          name="date"
          label="Preferred Date"
          error={fieldErrors.preferredDate}
        />

        <TimePicker
          id="time"
          name="time"
          label="Preferred Time"
          error={fieldErrors.preferredTime}
        />

        <Textarea
          id="message"
          name="message"
          label="Message"
          placeholder="Enter your message"
          className="sm:col-span-2"
          error={fieldErrors.message}
          onChange={() => clearError("message")}
        />

      </div>

      <Button
        type="submit"
        variant="primary"
        showIcon={false}
        disabled={status === "submitting"}
        className="mt-8 w-full"
      >
        {status === "submitting" ? "Sending..." : "Book Appointment"}
      </Button>

      {status === "success" && (
        <div role="status" className="mt-6 flex flex-col items-center gap-3 text-center">
          {/* Circle and tick draw themselves in (.draw-check) */}
          <svg viewBox="0 0 52 52" className="size-14 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="26" cy="26" r="23" pathLength={1} className="draw-check" />
            <path d="M16 27l7 7 13-15" pathLength={1} className="draw-check" style={{ "--delay": "0.6s" } as React.CSSProperties} />
          </svg>
          <p className="text-sm text-zinc-700">
            Thank you! We have received your request and will contact you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {apiError}
        </p>
      )}

    </form>
  );
}
