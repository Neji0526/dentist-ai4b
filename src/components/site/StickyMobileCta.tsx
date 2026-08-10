import Link from "next/link";

import { telHref } from "@/lib/format";

type Props = {
  phone: string | null;
};

/**
 * Persistent call / book bar on small screens. Mobile visitors convert by
 * tapping the phone number far more often than by filling in a form, so it
 * gets equal billing.
 */
export function StickyMobileCta({ phone }: Props) {
  const tel = telHref(phone);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        {tel ? (
          <a
            href={tel}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[0.9375rem] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5z" />
            </svg>
            Call now
          </a>
        ) : null}
        <Link
          href="/appointment"
          className={`inline-flex items-center justify-center rounded-full bg-brand-700 px-4 py-3 text-[0.9375rem] font-semibold text-white ring-1 ring-inset ring-brand-700 transition-colors hover:bg-white hover:text-brand-700 ${
            tel ? "" : "col-span-2"
          }`}
        >
          Book appointment
        </Link>
      </div>
    </div>
  );
}
