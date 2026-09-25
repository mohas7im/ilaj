"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api/errors";
import { submitContactInquiry } from "../_api/contactApi";

type Status = "idle" | "submitting" | "success" | "error";

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
    <form className="mt-6" onSubmit={handleSubmit}>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-base font-medium"
          >
            Full Name*
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter Your Full Name"
            required
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              outline-none
              placeholder:text-zinc-500
              focus:border-brand
            "
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-base font-medium"
          >
            Phone Number*
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            required
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              outline-none
              placeholder:text-zinc-500
              focus:border-brand
            "
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium"
          >
            Email Address*
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              outline-none
              placeholder:text-zinc-500
              focus:border-brand
            "
          />
        </div>

        {/* Treatment */}
        <div>
          <label
            htmlFor="treatment"
            className="block text-base font-medium"
          >
            Select Treatment*
          </label>

          <select
            id="treatment"
            name="treatment"
            required
            defaultValue=""
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              text-zinc-500
              outline-none
              focus:border-brand
            "
          >
            <option value="" disabled>
              Choose a treatment
            </option>

            <option value="Teeth Cleaning">
              Teeth Cleaning
            </option>

            <option value="Teeth Whitening">
              Teeth Whitening
            </option>

            <option value="Dental Implants">
              Dental Implants
            </option>

            <option value="Orthodontics">
              Orthodontics
            </option>

            <option value="Root Canal Treatment">
              Root Canal Treatment
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-base font-medium"
          >
            Preferred Date*
          </label>

          <input
            id="date"
            name="date"
            type="date"
            required
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              text-zinc-500
              outline-none
              focus:border-brand
            "
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label
            htmlFor="time"
            className="block text-base font-medium"
          >
            Preferred Time*
          </label>

          <input
            id="time"
            name="time"
            type="time"
            required
            className="
              mt-3
              h-12
              w-full
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              text-base
              text-zinc-500
              outline-none
              focus:border-brand
            "
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-base font-medium"
          >
            Message*
          </label>

          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Enter your message"
            required
            className="
              mt-3
              w-full
              resize-none
              border-0
              border-b
              border-zinc-300
              bg-transparent
              px-0
              py-2
              text-base
              outline-none
              placeholder:text-zinc-500
              focus:border-brand
            "
          />
        </div>

      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="
          mt-8
          h-14
          w-full
          rounded-full
          bg-brand
          px-6
          text-base
          font-semibold
          text-white
          transition
          hover:opacity-90
          disabled:opacity-60
        "
      >
        {status === "submitting" ? "Sending..." : "Book Appointment"}
      </button>

      {status === "success" && (
        <p role="status" className="mt-4 text-center text-base text-zinc-700">
          Thank you! We have received your request and will contact you soon.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 text-center text-base text-red-600">
          {error}
        </p>
      )}

    </form>
  );
}
