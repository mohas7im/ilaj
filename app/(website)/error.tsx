"use client";

import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import Button from "@/components/website/ui/Button";

// Shown when a website page fails to load (e.g. the database is being updated).
// Renders inside the website layout, so the navbar and footer stay visible.
// Errors in the layout itself are handled by app/global-error.tsx.
// Never show the error message or digest to visitors.

export default function WebsiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="w-full bg-white pt-20 text-zinc-950">
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-6 lg:px-8">
        <SectionTitle as="h1">We&apos;re updating our website</SectionTitle>
        <SectionDescription>Please try again in a few minutes.</SectionDescription>
        <Button onClick={() => reset()}>Try again</Button>
      </section>
    </main>
  );
}
