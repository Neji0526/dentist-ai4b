import type { Metadata } from "next";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { PeopleBand } from "@/components/site/PeopleBand";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { getDoctors, getServices, getSiteSettings } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/format";
import { breadcrumbSchema, buildMetadata, fullAddress } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: `Contact ${settings.clinic_name}`,
    description: `Call, email or visit ${settings.clinic_name}${
      settings.address_line ? ` at ${settings.address_line}, ${settings.city}` : ""
    }. Opening hours, directions and parking information.`,
    path: "/contact",
    settings,
  });
}

function InfoCard({
  icon,
  label,
  children,
  className = "",
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white p-6 ring-1 ring-ink-100 ${className}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ServiceIcon name={icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[1.0625rem] leading-tight">{label}</h2>
          <div className="mt-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default async function ContactPage() {
  const [settings, services, doctors] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getDoctors(),
  ]);

  const tel = telHref(settings.phone);
  const whatsapp = whatsappHref(settings.whatsapp);
  const address = fullAddress(settings);
  const directionsUrl = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      <PageHeader
        eyebrow="Contact us"
        title="Come and see us"
        description={
          <>
            A real person answers the phone during opening hours.
            <br className="hidden sm:block" /> For anything non-urgent, the form
            below reaches the same team.
          </>
        }
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        scene="reception"
        imageAlt={`Reception at ${settings.clinic_name}`}
      />

      <section className="py-12">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(400px,0.9fr)] lg:gap-10">
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {settings.phone ? (
                  <InfoCard icon="phone" label="Call us">
                    <a
                      href={tel ?? undefined}
                      className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-700 hover:underline"
                    >
                      {settings.phone}
                    </a>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Fastest way to reach us, including for emergencies.
                    </p>
                  </InfoCard>
                ) : null}

                {settings.email ? (
                  <InfoCard icon="mail" label="Email us">
                    <a
                      href={`mailto:${settings.email}`}
                      className="break-all font-semibold text-brand-700 hover:underline"
                    >
                      {settings.email}
                    </a>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      We reply within one business day.
                    </p>
                  </InfoCard>
                ) : null}
              </div>

              {address ? (
                <InfoCard icon="pin" label="Our location">
                  <address className="not-italic font-semibold text-ink-900">
                    {settings.address_line}
                    <br />
                    {[settings.city, settings.state, settings.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </address>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
                    {directionsUrl ? (
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        Get directions →
                      </a>
                    ) : null}
                    {whatsapp ? (
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-mint-700 hover:underline"
                      >
                        <ServiceIcon name="phone" className="h-4 w-4" />
                        Message us on WhatsApp →
                      </a>
                    ) : null}
                  </div>
                </InfoCard>
              ) : null}

              {settings.opening_hours.length > 0 ? (
                <InfoCard icon="clock" label="Opening hours">
                  <dl className="text-[0.9375rem]">
                    {settings.opening_hours.map((entry) => (
                      <div
                        key={entry.days}
                        className="flex justify-between gap-6 border-b border-ink-100 py-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-ink-600">{entry.days}</dt>
                        <dd className="font-semibold text-ink-900">{entry.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </InfoCard>
              ) : null}

              {settings.map_embed_url ? (
                <div className="overflow-hidden rounded-2xl ring-1 ring-ink-100">
                  <iframe
                    src={settings.map_embed_url}
                    title={`Map showing ${settings.clinic_name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[300px] w-full border-0"
                  />
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <LeadForm
                services={services}
                source="contact-page"
                icon="mail"
                title="Send us a message"
                description="Questions about insurance, costs or whether we can help? Ask away — we'll come back to you by phone."
              />
            </div>
          </div>
        </Container>
      </section>

      <PeopleBand
        title="Real people. Real care."
        description="Our friendly team is here to help you feel comfortable from your first call to your brightest smile."
        doctors={doctors}
      />
      <div className="pb-10" />
    </>
  );
}
