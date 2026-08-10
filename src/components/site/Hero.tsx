import { LeadForm } from "@/components/site/LeadForm";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Stars } from "@/components/ui/Stars";
import { telHref } from "@/lib/format";
import type { Doctor, Service, SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
  services: Service[];
  doctors: Doctor[];
  reviewCount: number;
  patientCount: string;
};

const HIGHLIGHTS = [
  "Same-day emergency appointments",
  "Licensed, experienced dentists",
  "Upfront pricing — no hidden fees",
  "Gentle care for nervous patients",
];

export function Hero({
  settings,
  services,
  doctors,
  reviewCount,
  patientCount,
}: Props) {
  const tel = telHref(settings.phone);
  const city = settings.city ?? "your area";

  return (
    <section className="bg-brand-50/50">
      <Container width="wide">
        <div className="grid items-start gap-12 py-14 lg:grid-cols-[1.08fr_minmax(380px,0.92fr)] lg:gap-16 lg:py-20">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-100/70 px-3.5 py-1.5 text-[0.8125rem] font-semibold text-brand-700">
              Gentle. Local. Trusted.
            </span>

            <h1 className="mt-6 text-[2.5rem] leading-[1.08] sm:text-[3.25rem] lg:text-[3.5rem]">
              Dental Care You
              <br className="hidden sm:block" /> Can Count On
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
              Friendly, modern dentistry for your whole family in {city} — from
              routine teeth cleaning to implants and cosmetic work. Same-day
              appointments available for emergencies.
            </p>

            <ul className="mt-7 grid gap-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-ink-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-brand-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8.4 12.2l2.5 2.5 4.7-4.9" />
                  </svg>
                  <span className="text-[0.9375rem]">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/appointment" size="lg">
                Book an appointment
              </ButtonLink>
              {tel ? (
                <ButtonLink href={tel} variant="secondary" size="lg">
                  <ServiceIcon name="phone" className="h-[18px] w-[18px]" />
                  Call Now
                </ButtonLink>
              ) : null}
            </div>

            {/* Social proof */}
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <AvatarStack people={doctors} size={36} />
              <p className="text-sm text-ink-600">
                Trusted by{" "}
                <span className="font-semibold text-ink-900">
                  {patientCount} patients
                </span>
              </p>
              <span className="hidden h-5 w-px bg-ink-200 sm:block" aria-hidden="true" />
              <p className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink-900">4.9</span>
                <Stars rating={5} />
                <span className="text-ink-500">({reviewCount}+ reviews)</span>
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <LeadForm
              services={services}
              source="hero"
              icon="calendar"
              title="Request an appointment"
              description="Send us your details and we'll call you back to confirm a time that suits you."
              footnote="We respond within one business hour"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
