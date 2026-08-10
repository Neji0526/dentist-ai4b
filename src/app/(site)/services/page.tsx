import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { FeatureBar } from "@/components/site/FeatureBar";
import { PageHeader } from "@/components/site/PageHeader";
import { ServiceCard } from "@/components/site/ServiceCard";
import { StatStrip } from "@/components/site/StatStrip";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getFaqs, getServices, getSiteSettings } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const city = settings.city ?? "your area";

  return buildMetadata({
    title: `Dental Services in ${city}`,
    description: `Teeth cleaning, dental implants, cosmetic dentistry, clear aligners and emergency dental care in ${city}. See what each treatment involves, how long it takes and what it costs.`,
    path: "/services",
    settings,
  });
}

const PROMISES = [
  {
    icon: "hands",
    title: "Gentle & modern care",
    copy: "Comfortable technology and unhurried appointments.",
  },
  {
    icon: "tag",
    title: "Clear pricing",
    copy: "Upfront costs and no surprises. We explain the options first.",
  },
  {
    icon: "shield",
    title: "Insurance welcome",
    copy: "We work with most PPO plans and maximise your benefits.",
  },
  {
    icon: "calendar",
    title: "Flexible scheduling",
    copy: "Evening and Saturday appointments available.",
  },
];

export default async function ServicesPage() {
  const [settings, services, faqs] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFaqs(),
  ]);

  const treatmentFaqs = faqs
    .filter((faq) => faq.category === "Treatments" || faq.category === "Payment")
    .slice(0, 5);

  const stats = [
    { icon: "hands", value: "12,000+", label: "Happy patients" },
    { icon: "star", value: "4.9/5", label: "Google reviews", highlight: true },
    { icon: "award", value: "18+", label: `Years in ${settings.city ?? "practice"}` },
    { icon: "clock", value: "Same-day", label: "Emergency care" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />

      <PageHeader
        eyebrow="Our services"
        title={`Dental services in ${settings.city ?? "your area"}`}
        description="Everything from a six-month hygiene visit to full implant restoration, delivered in one clinic by a team you will get to know. Every treatment page tells you what is involved, how long it takes and what it costs before you book."
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        scene="operatory"
        image={settings.hero_image_url}
        imageAlt={`Treatment room at ${settings.clinic_name}`}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/appointment" size="lg">
            <ServiceIcon name="calendar" className="h-[18px] w-[18px]" />
            Book an appointment
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            <ServiceIcon name="user-question" className="h-[18px] w-[18px]" />
            Ask us a question
          </ButtonLink>
        </div>

        <StatStrip stats={stats} className="mt-9" />
      </PageHeader>

      <section className="py-14">
        <Container width="wide">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index < 4}
                compact
              />
            ))}
          </div>

          {services.length === 0 ? (
            <p className="rounded-2xl bg-ink-50 p-8 text-center text-ink-600">
              Our service list is being updated. Please call us and we will talk
              you through what we offer.
            </p>
          ) : null}

          <FeatureBar items={PROMISES} variant="panel" className="mt-6" />
        </Container>
      </section>

      {treatmentFaqs.length > 0 ? (
        <section className="pb-14">
          <Container>
            <SectionHeading
              eyebrow="Before you book"
              title="Treatment and payment questions"
              description="Clear answers so you can book with confidence."
              className="mx-auto"
            />
            <div className="mt-9">
              <FaqAccordion faqs={treatmentFaqs} />
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        phone={settings.phone}
        icon="phone"
        title="Not sure which treatment you need?"
        description="That is what a consultation is for. Tell us what is bothering you and we will work it out together — no obligation to proceed."
      />
      <div className="pb-14" />
    </>
  );
}
