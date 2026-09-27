import * as React from "react";
import { Plus } from "lucide-react";
import SectionLabel from "./SectionLabel";
import SectionTitle from "./SectionTitle";
import SectionDescription from "./SectionDescription";
import CardTitle from "./CardTitle";
import CardText from "./CardText";

export type FaqItem = { question: string; answer: string };

export interface FaqProps {
  faqs: FaqItem[];
  /** Heading on the left; wrap the red part in <Highlight> */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Accordion group name; only one question in a group is open at a time */
  name: string;
}

// FAQ block used on the home, contact and service pages: heading on the left,
// accordion on the right. Native <details> (no JS); the open/close slide
// animation is `.faq-item` in styles/website/theme.css.
export function Faq({ faqs, title, description, name }: FaqProps) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">

      <div className="lg:col-span-5">
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>{title}</SectionTitle>
        {description && (
          <SectionDescription className="mt-5 max-w-md">{description}</SectionDescription>
        )}
      </div>

      <div className="border-b border-zinc-200 lg:col-span-7">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            name={name}
            open={index === 0}
            style={{ "--i": index } as React.CSSProperties}
            className="faq-item reveal group border-t border-zinc-200"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <CardTitle as="span" size="sm" className="transition-colors group-hover:text-brand">
                {faq.question}
              </CardTitle>
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-950 transition-[rotate,background-color,color,border-color] duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </span>
            </summary>

            <CardText className="max-w-xl pb-6 pr-14">{faq.answer}</CardText>
          </details>
        ))}
      </div>

    </div>
  );
}

export default Faq;
