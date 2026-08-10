"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { subscribeAction } from "@/app/actions/subscribe";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Container } from "@/components/ui/Container";
import { initialSubscribeState } from "@/lib/subscribe-state";

type Props = {
  source?: string;
};

function SubscribeButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? "Signing up…" : "Subscribe"}
    </button>
  );
}

export function NewsletterBand({ source = "blog" }: Props) {
  const [state, formAction] = useActionState(subscribeAction, initialSubscribeState);

  return (
    <section className="py-10">
      <Container width="wide">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-brand-50/60 px-6 py-8 ring-1 ring-brand-100/70 sm:px-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100/60 text-brand-600 ring-1 ring-brand-100">
              <ServiceIcon name="mail" className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-[1.375rem] leading-tight">
                Helpful dental tips, straight to your inbox
              </h2>
              <p className="mt-1.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                New articles, guides, and special offers — no spam, unsubscribe
                anytime.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            {state.status === "success" ? (
              <p className="flex items-center gap-2 rounded-xl bg-mint-50 px-4 py-3 text-sm font-medium text-mint-800 ring-1 ring-inset ring-mint-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {state.message}
              </p>
            ) : (
              <form action={formAction} className="w-full">
                <input type="hidden" name="source" value={source} />
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Your email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:w-64"
                  />
                  <SubscribeButton />
                </div>
                {state.status === "error" && state.message ? (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {state.message}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
