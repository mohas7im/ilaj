"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, LoaderCircle, CalendarClock, Sparkles } from "lucide-react";
import Button from "@/components/website/ui/Button";
import Input from "@/components/website/ui/Input";
import Select from "@/components/website/ui/Select";
import Textarea from "@/components/website/ui/Textarea";
import DatePicker from "@/components/website/ui/DatePicker";
import TimePicker from "@/components/website/ui/TimePicker";
import { submitContactInquiry } from "@/app/(website)/contact/_api/contactApi";
import { getApiErrorMessage } from "@/lib/api/errors";

const TREATMENTS = [
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Orthodontics",
  "Root Canal Treatment",
  "Other",
];

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
  preferredDate: z.string(),
  preferredTime: z.string(),
  message: z.string(),
});

type FormFields = z.infer<typeof formSchema>;
type FieldErrors = Partial<Record<keyof FormFields, string>>;

type SubmittedData = {
  firstName: string;
  phone: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
};

export default function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const clearError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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

      const firstName = result.data.fullName.split(/\s+/)[0];
      setSubmittedData({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        phone: result.data.phone,
        treatment: result.data.treatment === "Other" ? "" : result.data.treatment,
        preferredDate: result.data.preferredDate,
        preferredTime: result.data.preferredTime,
      });
      setStatus("idle");
    } catch (err) {
      setApiError(
        getApiErrorMessage(err, "Could not send your request. Please try again or call us.")
      );
      setStatus("error");
    }
  };

  if (submittedData) {
    return (
      <div className="py-8 text-center sm:py-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="size-8" />
        </div>

        <h2 className="mt-5 font-heading text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
          Thank you, <span className="text-brand">{submittedData.firstName}</span>!
        </h2>

        <p className="mx-auto mt-2 max-w-md text-zinc-600">
          Your appointment request has been submitted successfully. Our clinic team will get in touch shortly to confirm your booking.
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-5 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <CalendarClock className="size-4 text-brand" />
            <span>Booking Request Summary</span>
          </div>

          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            {submittedData.treatment && (
              <div className="flex justify-between border-b border-zinc-200/70 pb-2">
                <span className="text-zinc-500">Treatment:</span>
                <span className="font-medium text-zinc-900">{submittedData.treatment}</span>
              </div>
            )}
            {submittedData.preferredDate && (
              <div className="flex justify-between border-b border-zinc-200/70 pb-2">
                <span className="text-zinc-500">Requested Date:</span>
                <span className="font-medium text-zinc-900">{submittedData.preferredDate}</span>
              </div>
            )}
            {submittedData.preferredTime && (
              <div className="flex justify-between border-b border-zinc-200/70 pb-2">
                <span className="text-zinc-500">Preferred Time:</span>
                <span className="font-medium text-zinc-900">{submittedData.preferredTime}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Contact Number:</span>
              <span className="font-medium text-zinc-900">{submittedData.phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            showIcon={false}
            onClick={() => setSubmittedData(null)}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <Input
          id="page-fullName"
          name="fullName"
          type="text"
          label="Full Name *"
          placeholder="Enter Your Full Name"
          error={fieldErrors.fullName}
          onChange={() => clearError("fullName")}
        />

        <Input
          id="page-phone"
          name="phone"
          type="tel"
          label="Phone Number *"
          placeholder="Enter your phone number"
          error={fieldErrors.phone}
          onChange={() => clearError("phone")}
        />

        <Input
          id="page-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          error={fieldErrors.email}
          onChange={() => clearError("email")}
        />

        <Select
          id="page-treatment"
          name="treatment"
          label="Select Treatment"
          placeholder="Choose a treatment"
          options={TREATMENTS}
          error={fieldErrors.treatment}
        />

        <DatePicker
          id="page-date"
          name="date"
          label="Preferred Date"
          placeholder="Select a date"
          error={fieldErrors.preferredDate}
        />

        <TimePicker
          id="page-time"
          name="time"
          label="Preferred Time"
          placeholder="Select preferred time"
          error={fieldErrors.preferredTime}
        />

        <Textarea
          id="page-message"
          name="message"
          label="Additional Notes (Optional)"
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
        aria-busy={status === "submitting"}
        className="mt-8 w-full py-3.5 text-base justify-center shadow-md hover:shadow-lg transition-all"
      >
        <span className="relative inline-flex items-center justify-center">
          <span className={status === "submitting" ? "invisible" : undefined}>
            Confirm Appointment Request
          </span>
          {status === "submitting" && (
            <>
              <LoaderCircle aria-hidden="true" className="absolute size-5 animate-spin" />
              <span className="sr-only">Sending request…</span>
            </>
          )}
        </span>
      </Button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-sm font-medium text-red-600">
          {apiError}
        </p>
      )}
    </form>
  );
}
