import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PageHeader } from "@/components/site/PageHeader";
import { PeopleBand } from "@/components/site/PeopleBand";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getDoctors, getFaqs, getSiteSettings } from "@/lib/data";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import type { Faq } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: "Patient Questions & Answers",
    description:
      "Appointment availability, insurance, treatment costs, dental anxiety and emergencies — the questions our patients ask most, answered plainly.",
    path: "/faq",
    settings,
  });
}

/** Category → icon, so each group reads at a glance. */
const CATEGORY_ICONS: Record<string, string> = {
  Appointments: "calendar",
  Payment: "card",
  Comfort: "heart",
  Treatments: "tooth",
  Children: "child",
  Emergencies: "bell",
  General: "question",
};

export default async function FaqPage() {
  const [settings, faqs, doctors] = await Promise.all([
    getSiteSettings(),
    getFaqs(),
    getDoctors(),
  ]);

  // Preserve CMS ordering while grouping, so editors control the sequence.
  const categories = faqs.reduce<{ name: string; items: Faq[] }[]>(
    (groups, faq) => {
      const name = faq.category ?? "General";
      const existing = groups.find((group) => group.name === name);
      if (existing) existing.items.push(faq);
      else groups.push({ name, items: [faq] });
      return groups;
    },
    [],
  );

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([{ name: "FAQ", path: "/faq" }])} />

      <PageHeader
        eyebrow="Patient FAQ"
        title="Your questions,"
        titleAccent="answered plainly"
        description="If your question is not here, call us or send it through the contact form — a real person answers, and there is no such thing as a silly dental question."
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
        scene="tooth-model"
        imageAlt="A dental model on a clinic counter"
      />

      <section className="py-14">
        <Container width="wide">
          {faqs.length === 0 ? (
            <p className="rounded-2xl bg-ink-50 p-8 text-center text-ink-600">
              We’re compiling our patient FAQ. Please call us in the meantime.
            </p>
          ) : (
            <div className="grid gap-10">
              {categories.map((group) => (
                <div
                  key={group.name}
                  className="grid gap-5 lg:grid-cols-[auto_1fr] lg:gap-8"
                >
                  <div className="flex items-center gap-3.5 lg:w-52 lg:items-start">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <ServiceIcon
                        name={CATEGORY_ICONS[group.name] ?? "question"}
                        className="h-[22px] w-[22px]"
                      />
                    </span>
                    <h2 className="text-xl leading-tight">{group.name}</h2>
                  </div>

                  <FaqAccordion faqs={group.items} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        phone={settings.phone}
        icon="question"
        title="Still have a question?"
        description="Ask us directly — we would rather answer it now than have you wonder about it in the chair."
      />

      <PeopleBand
        title="Real people. Real answers."
        description="No bots, no runaround. Just our team, here to help."
        doctors={doctors}
      />
      <div className="pb-10" />
    </>
  );
}
