"use client";

import { useState } from "react";
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

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const fields = new FormData(formElement);
    const value = (name: string) => String(fields.get(name) ?? "");

    setStatus("submitting");
    try {
      await submitContactInquiry({
        fullName: value("fullName"),
        phone: value("phone"),
        email: value("email"),
        treatment: value("treatment"),
        preferredDate: value("date"),
        preferredTime: value("time"),
        message: value("message"),
      });
      formElement.reset();
      setStatus("success");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send your request. Please try again or call us."));
      setStatus("error");
    }
  };

  return (
    <form className="mt-3" onSubmit={handleSubmit}>

      <div className="grid grid-cols-1 gap-x-3.5 gap-y-4 sm:grid-cols-2">

        <Input id="fullName" name="fullName" type="text" label="Full Name*" placeholder="Enter Your Full Name" required />

        <Input id="phone" name="phone" type="tel" label="Phone Number*" placeholder="Enter your phone number" required />

        <Input id="email" name="email" type="email" label="Email Address*" placeholder="Enter your email address" required />

        <Select id="treatment" name="treatment" label="Select Treatment*" placeholder="Choose a treatment" options={TREATMENTS} required />

        <DatePicker id="date" name="date" label="Preferred Date*" required />

        <TimePicker id="time" name="time" label="Preferred Time*" required />

        <Textarea
          id="message"
          name="message"
          label="Message*"
          placeholder="Enter your message"
          required
          className="sm:col-span-2"
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
          {error}
        </p>
      )}

    </form>
  );
}
