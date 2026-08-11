import type { Metadata } from "next";

import { FeatureBar } from "@/components/site/FeatureBar";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Stars } from "@/components/ui/Stars";
import { getServices, getSiteSettings, getTestimonials } from "@/lib/data";
import { telHref } from "@/lib/format";
import { localImage } from "@/lib/local-media";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: `Book a Dental Appointment in ${settings.city ?? "your area"}`,
    description: `Request an appointment at ${settings.clinic_name} in under a minute. Same-week checkups, same-day emergency slots, and a callback within one business hour.`,
    path: "/appointment",
    settings,
  });
}

const STEPS = [
  {
    icon: "card",
    title: "Send your details",
    copy: "Name, phone and roughly what you need. Under a minute, no account required.",
  },
  {
    icon: "clock",
    title: "We call you back",
    copy: "Within one business hour, to agree a time that actually suits you.",
  },
  {
    icon: "heart",
    title: "Come in and relax",
    copy: "Arrive a few minutes early, meet your dentist, and leave with a written plan.",
  },
];

/**
 * Title-only, as in the design — the closing band reassures at a glance rather
 * than repeating what the page has already said.
 */
const REASSURANCE = [
  { icon: "shield", title: "Same-day emergency care when possible" },
  { icon: "card", title: "Most insurance plans accepted" },
  { icon: "chair", title: "Comfortable, modern clinic" },
  { icon: "users", title: "Friendly team here to help" },
];

export default async function AppointmentPage() {
  const [settings, services, testimonials] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getTestimonials(3),
  ]);

  const tel = telHref(settings.phone);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Book an appointment", path: "/appointment" },
        ])}
      />

      <PageHeader
        eyebrow="Appointments"
        title="Book your dental appointment"
        description="Fill in the form and we will call you back within one business hour to confirm. Prefer to talk to a person right away? Call us — we always answer during opening hours."
        breadcrumbs={[{ name: "Book an appointment", path: "/appointment" }]}
        scene="operatory"
        // CMS setting wins; otherwise public/images/appointment-hero.jpg if it
        // has been added; otherwise the illustrated operatory scene.
        image={settings.hero_image_url ?? localImage("appointment-hero.jpg")}
        imageAlt={`Treatment room at ${settings.clinic_name}`}
      >
        {tel ? (
          <a
            href={tel}
            className="inline-flex items-center gap-3.5 rounded-2xl bg-white px-5 py-4 ring-1 ring-ink-100 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(13,31,45,0.3)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ServiceIcon name="phone" className="h-[22px] w-[22px]" />
            </span>
            <span>
              <span className="block text-sm text-ink-500">Call the clinic</span>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-700">
                {settings.phone}
              </span>
            </span>
          </a>
        ) : null}
      </PageHeader>

      <section className="py-12">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.95fr)] lg:gap-10">
            <div className="grid gap-6">
              {/* How booking works */}
              <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
                <h2 className="text-lg">How booking works</h2>
                <ol className="mt-5 divide-y divide-ink-100">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <ServiceIcon name={step.icon} className="h-[22px] w-[22px]" />
                      </span>
                      <div>
                        <p className="font-semibold text-ink-900">
                          <span className="mr-1.5 text-brand-500">{index + 1}.</span>
                          {step.title}
                        </p>
                        <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-600">
                          {step.copy}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Opening hours */}
              {settings.opening_hours.length > 0 ? (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <ServiceIcon name="clock" className="h-[22px] w-[22px]" />
                    </span>
                    <h2 className="text-lg">Opening hours</h2>
                  </div>

                  <dl className="mt-5 text-[0.9375rem]">
                    {settings.opening_hours.map((entry) => (
                      <div
                        key={entry.days}
                        className="flex justify-between gap-6 border-b border-ink-100 py-2.5 last:border-0 last:pb-0"
                      >
                        <dt className="text-ink-600">{entry.days}</dt>
                        <dd className="font-semibold text-ink-900">{entry.hours}</dd>
                      </div>
                    ))}
                  </dl>

                  {settings.emergency_note ? (
                    <p className="mt-5 flex items-start gap-3 rounded-xl bg-mint-50 px-4 py-3.5 text-sm leading-relaxed text-mint-900">
                      <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-500 text-white">
                        <ServiceIcon name="phone" className="h-3.5 w-3.5" />
                      </span>
                      {settings.emergency_note}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Recent patients */}
              {testimonials.length > 0 ? (
                <div>
                  <h2 className="text-base font-semibold text-ink-900">
                    Patients who booked recently
                  </h2>
                  <ul className="mt-4 grid gap-3">
                    {testimonials.map((testimonial) => (
                      <li key={testimonial.id} className="rounded-2xl bg-ink-50 p-5">
                        <Stars rating={testimonial.rating} />
                        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-700">
                          “{testimonial.message}”
                        </p>
                        <p className="mt-2.5 text-sm font-semibold text-ink-900">
                          {testimonial.patient_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <LeadForm
                services={services}
                source="appointment-page"
                icon="calendar"
                title="Request your appointment"
                description="All fields marked with * are required. We only use your details to contact you about this appointment."
                withScheduling
              />
            </div>
          </div>
        </Container>
      </section>

      <FeatureBar items={REASSURANCE} />
    </>
  );
}
