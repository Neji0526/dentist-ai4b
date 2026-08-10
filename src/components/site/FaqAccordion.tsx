import type { Faq } from "@/lib/types";

type Props = {
  faqs: Faq[];
  /** Opens the first item, useful on the FAQ page itself. */
  defaultOpenFirst?: boolean;
};

/**
 * Built on <details>, so it works with JavaScript disabled and stays
 * keyboard-accessible without any custom ARIA wiring.
 */
export function FaqAccordion({ faqs, defaultOpenFirst = false }: Props) {
  return (
    <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
      {faqs.map((faq, index) => (
        <details
          key={faq.id}
          className="group px-5 py-1 sm:px-6"
          open={defaultOpenFirst && index === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-ink-900 marker:content-none">
            <span>{faq.question}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition-all group-open:rotate-45 group-open:bg-brand-50 group-open:text-brand-600">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="pb-5 pr-10 text-[0.9375rem] leading-relaxed text-ink-600">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
