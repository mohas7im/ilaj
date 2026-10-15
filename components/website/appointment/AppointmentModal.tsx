"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, LoaderCircle, CalendarClock, PhoneCall } from "lucide-react";
import Modal from "@/components/website/ui/Modal";
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

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicPhone?: string;
  /**
   * "appointment" (default): booking form with treatment, date and time.
   * "inquiry": a question about one treatment — no date/time, question required.
   */
  mode?: "appointment" | "inquiry";
  /** Inquiry mode: the treatment being asked about (shown locked) */
  treatment?: string;
}

export function AppointmentModal({
  isOpen,
  onClose,
  clinicPhone,
  mode = "appointment",
  treatment = "",
}: AppointmentModalProps) {
  const isInquiry = mode === "inquiry";
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const resetFormState = () => {
    setStatus("idle");
    setApiError("");
    setFieldErrors({});
    setSubmittedData(null);
  };

  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      resetFormState();
    }, 300);
  };

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
      treatment: isInquiry ? treatment : value("treatment"),
      preferredDate: value("date"),
      preferredTime: value("time"),
      message: value("message"),
    };

    const result = formSchema.safeParse(raw);
    const errors: FieldErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormFields;
        if (!errors[field]) errors[field] = issue.message;
      }
    }
    // The question is the whole point of an inquiry
    if (isInquiry && !raw.message) errors.message = "Please enter your question";
    if (!result.success || Object.keys(errors).length > 0) {
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
        type: mode,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      ariaLabelledBy="appointment-modal-title"
      ariaDescribedBy="appointment-modal-desc"
      cardClassName="p-6 sm:p-7 sm:px-8 pb-7 sm:pb-8"
    >
      {submittedData ? (
        /* Confirmation screen */
        <div className="py-2 text-center sm:py-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-6 ring-emerald-50/60">
            <CheckCircle2 className="size-7" />
          </div>

          <h2
            id="appointment-modal-title"
            className="mt-4 font-heading text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl"
          >
            Thanks, <span className="text-brand">{submittedData.firstName}</span>!
          </h2>

          <p id="appointment-modal-desc" className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-zinc-600">
            {isInquiry
              ? "Your question has been received. Our team will get back to you shortly."
              : "Your appointment request has been received. Our clinic team will call you to confirm your visit."}
          </p>

          {/* Submission Details Card */}
          <div className="mx-auto mt-5 max-w-md rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-3.5 text-left sm:p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <CalendarClock className="size-4 text-brand" />
              <span>{isInquiry ? "Inquiry Summary" : "Requested Booking Summary"}</span>
            </div>

            <div className="mt-2.5 space-y-1.5 text-sm text-zinc-700">
              {submittedData.treatment && (
                <div className="flex justify-between border-b border-zinc-200/70 pb-1.5">
                  <span className="text-zinc-500">Service:</span>
                  <span className="font-medium text-zinc-900">{submittedData.treatment}</span>
                </div>
              )}
              {submittedData.preferredDate && (
                <div className="flex justify-between border-b border-zinc-200/70 pb-1.5">
                  <span className="text-zinc-500">Preferred Date:</span>
                  <span className="font-medium text-zinc-900">{submittedData.preferredDate}</span>
                </div>
              )}
              {submittedData.preferredTime && (
                <div className="flex justify-between border-b border-zinc-200/70 pb-1.5">
                  <span className="text-zinc-500">Preferred Time:</span>
                  <span className="font-medium text-zinc-900">{submittedData.preferredTime}</span>
                </div>
              )}
              <div className="flex justify-between pt-0.5">
                <span className="text-zinc-500">Contact Number:</span>
                <span className="font-medium text-zinc-900">{submittedData.phone}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse items-center justify-center gap-2.5 sm:flex-row">
            <Button
              variant="outline"
              showIcon={false}
              onClick={() => setSubmittedData(null)}
              className="w-full sm:w-auto"
            >
              {isInquiry ? "Ask another question" : "Book another appointment"}
            </Button>
            <Button
              variant="primary"
              showIcon={false}
              onClick={handleModalClose}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <div>
          {/* Header - No pill, clean & compact */}
          <div className="pr-8">
            <h2
              id="appointment-modal-title"
              className="font-heading text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl"
            >
              {isInquiry ? (
                <>Ask about <span className="text-brand">{treatment}</span></>
              ) : (
                <>Book an <span className="text-brand">Appointment</span></>
              )}
            </h2>

            <p id="appointment-modal-desc" className="mt-1 text-xs sm:text-sm text-zinc-500">
              {isInquiry
                ? "Have a question about cost, duration or recovery? Send it to us and our team will get back to you."
                : "Select your preferred service and schedule. Our team will get in touch to confirm your visit."}
            </p>
          </div>

          {/* Form */}
          <form className="mt-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <Input
                id="modal-fullName"
                name="fullName"
                type="text"
                label="Full Name *"
                placeholder="Enter Your Full Name"
                error={fieldErrors.fullName}
                onChange={() => clearError("fullName")}
              />

              <Input
                id="modal-phone"
                name="phone"
                type="tel"
                label="Phone Number *"
                placeholder="Enter your phone number"
                error={fieldErrors.phone}
                onChange={() => clearError("phone")}
              />

              <Input
                id="modal-email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                error={fieldErrors.email}
                onChange={() => clearError("email")}
              />

              {isInquiry ? (
                // The visitor is on this treatment's page, so it's fixed
                <Input
                  id="modal-treatment"
                  type="text"
                  label="Treatment"
                  value={treatment}
                  readOnly
                  aria-readonly="true"
                />
              ) : (
                <>
                  <Select
                    id="modal-treatment"
                    name="treatment"
                    label="Select Treatment"
                    placeholder="Choose a treatment"
                    options={TREATMENTS}
                    error={fieldErrors.treatment}
                  />

                  <DatePicker
                    id="modal-date"
                    name="date"
                    label="Preferred Date"
                    placeholder="Select a date"
                    error={fieldErrors.preferredDate}
                  />

                  <TimePicker
                    id="modal-time"
                    name="time"
                    label="Preferred Time"
                    placeholder="Select preferred time"
                    error={fieldErrors.preferredTime}
                  />
                </>
              )}

              <Textarea
                id="modal-message"
                name="message"
                label={isInquiry ? "Your Question *" : "Additional Notes (Optional)"}
                placeholder={
                  isInquiry
                    ? "Ask about cost, duration, recovery, or whether this treatment is right for you"
                    : "Enter your message"
                }
                className="sm:col-span-2"
                textareaClassName={isInquiry ? "h-24" : "h-16"}
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
              className="mt-5 w-full py-2.5 sm:py-3 text-sm sm:text-base justify-center shadow-md hover:shadow-lg transition-all"
            >
              <span className="relative inline-flex items-center justify-center">
                <span className={status === "submitting" ? "invisible" : undefined}>
                  {isInquiry ? "Send Inquiry" : "Confirm Appointment Request"}
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
              <p role="alert" className="mt-3 text-center text-xs sm:text-sm font-medium text-red-600">
                {apiError}
              </p>
            )}

            {clinicPhone && (
              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                <PhoneCall className="size-3 text-brand" />
                <span>{isInquiry ? "Prefer to talk? Call us at " : "Prefer to book by phone? Call us at "}</span>
                <a
                  href={`tel:${clinicPhone}`}
                  className="font-semibold text-zinc-800 hover:text-brand transition-colors underline underline-offset-2"
                >
                  {clinicPhone}
                </a>
              </div>
            )}
          </form>
        </div>
      )}
    </Modal>
  );
}

export default AppointmentModal;
