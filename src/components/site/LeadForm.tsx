"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

import { initialLeadFormState, submitLeadAction } from "@/app/actions/lead";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

type Props = {
  /** Service titles offered in the dropdown. */
  services?: { title: string; slug: string }[];
  /** Pre-selects a service, e.g. on a service detail page. */
  defaultService?: string;
  /** Tags the lead in the CMS so you can see which CTA converted. */
  source?: string;
  variant?: "card" | "plain";
  title?: string;
  description?: string;
  /** Ask for a preferred day and time as well as the basics. */
  withScheduling?: boolean;
  /** Icon badge above the form heading. Pass null for a heading-only card. */
  icon?: string | null;
  /** Reassurance line under the submit button, e.g. response time. */
  footnote?: string;
  className?: string;
};

const TIME_SLOTS = [
  "As soon as possible",
  "Morning (8am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Late afternoon (4pm – 6pm)",
  "Saturday",
];

const FIELD =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";
const LABEL = "block text-sm font-medium text-ink-800 mb-1.5";
const ERROR = "mt-1.5 text-sm text-red-600";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending}
      aria-live="polite"
    >
      {pending ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="3"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          Sending…
        </>
      ) : (
        <>
          <ServiceIcon name="send" className="h-[18px] w-[18px]" />
          Request my appointment
        </>
      )}
    </Button>
  );
}

export function LeadForm({
  services = [],
  defaultService,
  source = "website",
  variant = "card",
  title = "Request an appointment",
  description = "Send us your details and we'll call you back within one business hour to confirm a time.",
  withScheduling = false,
  icon = "calendar",
  footnote,
  className = "",
}: Props) {
  const [state, formAction] = useActionState(submitLeadAction, initialLeadFormState);
  const pathname = usePathname();

  const shell =
    variant === "card"
      ? "rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(13,31,45,0.04),0_24px_48px_-24px_rgba(13,31,45,0.22)] ring-1 ring-ink-100 sm:p-7"
      : "";

  if (state.status === "success") {
    return (
      <div className={`${shell} ${className}`}>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint-100 text-mint-700">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="mt-5 text-xl">Thank you — we’ve got your request</h3>
          <p className="mt-2 max-w-sm text-ink-600">
            One of our team will call you within one business hour to confirm your
            appointment. If it’s urgent, please call us directly.
          </p>
        </div>
      </div>
    );
  }

  const values = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <div className={`${shell} ${className}`}>
      {variant === "card" ? (
        <div className="mb-6">
          {icon ? (
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ServiceIcon name={icon} className="h-6 w-6" />
            </span>
          ) : null}
          <h3 className="text-xl">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{description}</p>
        </div>
      ) : null}

      <form action={formAction} className="grid gap-4" noValidate>
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="page_path" value={pathname} />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {state.status === "error" && state.message ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100"
          >
            {state.message}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="lead-name">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={values.name ?? ""}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              className={FIELD}
              placeholder="Jane Doe"
            />
            {errors.name ? (
              <p id="lead-name-error" className={ERROR}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label className={LABEL} htmlFor="lead-phone">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.phone ?? ""}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "lead-phone-error" : undefined}
              className={FIELD}
              placeholder="(512) 555-0142"
            />
            {errors.phone ? (
              <p id="lead-phone-error" className={ERROR}>
                {errors.phone}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-email">
            Email <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email ?? ""}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "lead-email-error" : undefined}
            className={FIELD}
            placeholder="jane@example.com"
          />
          {errors.email ? (
            <p id="lead-email-error" className={ERROR}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-service">
            What do you need?
          </label>
          <select
            id="lead-service"
            name="service"
            defaultValue={values.service ?? defaultService ?? ""}
            className={FIELD}
          >
            <option value="">I’m not sure yet</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        {withScheduling ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="lead-date">
                Preferred date
              </label>
              <input
                id="lead-date"
                name="preferred_date"
                type="date"
                defaultValue={values.preferred_date ?? ""}
                aria-invalid={Boolean(errors.preferred_date)}
                className={FIELD}
              />
              {errors.preferred_date ? (
                <p className={ERROR}>{errors.preferred_date}</p>
              ) : null}
            </div>
            <div>
              <label className={LABEL} htmlFor="lead-time">
                Preferred time
              </label>
              <select
                id="lead-time"
                name="preferred_time"
                defaultValue={values.preferred_time ?? ""}
                className={FIELD}
              >
                <option value="">Any time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        <div>
          <label className={LABEL} htmlFor="lead-message">
            Anything we should know?{" "}
            <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            defaultValue={values.message ?? ""}
            className={`${FIELD} resize-y`}
            placeholder="Nervous patient, a specific tooth hurting, insurance questions…"
          />
          {errors.message ? <p className={ERROR}>{errors.message}</p> : null}
        </div>

        <SubmitButton />

        {footnote ? (
          <p className="flex items-center justify-center gap-2 text-sm text-ink-600">
            <ServiceIcon name="clock" className="h-4 w-4 shrink-0 text-brand-500" />
            {footnote}
          </p>
        ) : null}

        <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-ink-500">
          <ServiceIcon name="lock" className="mt-px h-3.5 w-3.5 shrink-0 text-ink-400" />
          <span>
            We use your details only to contact you about your appointment. No
            marketing, ever.
          </span>
        </p>
      </form>
    </div>
  );
}
