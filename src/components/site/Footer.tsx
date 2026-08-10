import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { SocialLinks } from "@/components/site/SocialLinks";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { telHref } from "@/lib/format";
import type { Service, SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
  services: Service[];
};

const CLINIC_LINKS = [
  { href: "/services", label: "All services" },
  { href: "/doctors", label: "Meet the dentists" },
  { href: "/blog", label: "Dental health blog" },
  { href: "/faq", label: "Patient FAQ" },
  { href: "/contact", label: "Contact & directions" },
  { href: "/appointment", label: "Book an appointment" },
];

export function Footer({ settings, services }: Props) {
  const tel = telHref(settings.phone);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50">
      <Container width="wide">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-[family-name:var(--font-display)] text-[1.0625rem] font-bold tracking-tight text-ink-900">
                {settings.clinic_name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              {settings.tagline ??
                "Gentle, modern dentistry for the whole family."}
            </p>
            {settings.emergency_note ? (
              <p className="mt-5 flex items-start gap-3 rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-100">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5z" />
                  </svg>
                </span>
                {settings.emergency_note}
              </p>
            ) : null}

            <div className="mt-6">
              <SocialLinks settings={settings} />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-900">
              Treatments
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-900">
              The clinic
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {CLINIC_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-900">
              Visit us
            </h2>
            <address className="mt-4 grid gap-3 text-sm not-italic text-ink-600">
              {settings.address_line ? (
                <span className="flex items-start gap-2.5">
                  <ServiceIcon
                    name="pin"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                  />
                  <span>
                    {settings.address_line}
                    <br />
                    {[settings.city, settings.state, settings.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </span>
              ) : null}
              {tel ? (
                <a href={tel} className="flex items-center gap-2.5">
                  <ServiceIcon name="phone" className="h-4 w-4 shrink-0 text-brand-500" />
                  <span className="font-semibold text-brand-700 hover:underline">
                    {settings.phone}
                  </span>
                </a>
              ) : null}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 hover:text-brand-700"
                >
                  <ServiceIcon name="mail" className="h-4 w-4 shrink-0 text-brand-500" />
                  <span className="break-all">{settings.email}</span>
                </a>
              ) : null}
            </address>

            {settings.opening_hours.length > 0 ? (
              <dl className="mt-5 grid gap-1.5 text-sm">
                {settings.opening_hours.map((entry) => (
                  <div key={entry.days} className="flex justify-between gap-4">
                    <dt className="text-ink-600">{entry.days}</dt>
                    <dd className="font-medium text-ink-800">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-200 py-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.clinic_name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="hover:text-ink-800">
              Privacy policy
            </Link>
            <Link href="/admin" className="hover:text-ink-800">
              Staff login
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
