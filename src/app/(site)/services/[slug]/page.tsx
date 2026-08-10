import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import {
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getTestimonialsForService,
} from "@/lib/data";
import { formatPrice, telHref, truncate } from "@/lib/format";
import { renderMarkdown, stripMarkdown } from "@/lib/markdown";
import { breadcrumbSchema, buildMetadata, serviceSchema } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettings(),
  ]);

  if (!service) {
    return { title: "Service not found", robots: { index: false } };
  }

  return buildMetadata({
    title: service.meta_title ?? `${service.title} in ${settings.city ?? "your area"}`,
    description:
      service.meta_description ??
      service.short_description ??
      truncate(stripMarkdown(service.description), 155),
    path: `/services/${service.slug}`,
    settings,
    image: service.image_url,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, settings, services] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettings(),
    getServices(),
  ]);

  if (!service) notFound();

  const reviews = await getTestimonialsForService(service.id);
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const price = formatPrice(service.price_from);
  const tel = telHref(settings.phone);

  return (
    <>
      <JsonLd data={serviceSchema(service, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <PageHeader
        eyebrow="Treatment"
        title={service.title}
        description={service.short_description ?? undefined}
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        scene="operatory"
        image={service.hero_image_url ?? service.image_url}
        imageAlt={service.title}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {price ? (
            <div>
              <dt className="text-sm text-ink-500">Starting from</dt>
              <dd className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold text-ink-900">
                {price}
              </dd>
            </div>
          ) : null}
          {service.duration ? (
            <div>
              <dt className="text-sm text-ink-500">Typical duration</dt>
              <dd className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold text-ink-900">
                {service.duration}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-sm text-ink-500">Next availability</dt>
            <dd className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold text-mint-700">
              This week
            </dd>
          </div>
        </dl>
      </PageHeader>

      <section className="py-14">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_minmax(340px,0.75fr)] lg:gap-14">
            <div>
              {service.image_url ? (
                <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              {service.benefits.length > 0 ? (
                <div className="mb-10 rounded-2xl bg-mint-50/70 p-6 ring-1 ring-mint-100">
                  <h2 className="text-lg">Why patients choose this treatment</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500 text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="text-[0.9375rem] leading-relaxed text-ink-700">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div
                className="prose-clinic"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(service.description),
                }}
              />

              {reviews.length > 0 ? (
                <div className="mt-12">
                  <h2 className="text-xl">What patients said about this treatment</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {reviews.map((review) => (
                      <TestimonialCard key={review.id} testimonial={review} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-12 rounded-2xl bg-ink-50 p-6">
                <h2 className="text-lg">Costs and payment</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                  {price
                    ? `${service.title} starts from ${price}. Your exact cost depends on what we find at your assessment, and you will always have it in writing — with your insurance estimate separated out — before any treatment begins.`
                    : `We will quote ${service.title.toLowerCase()} in writing after your assessment, with your insurance estimate separated out, before any treatment begins.`}{" "}
                  Interest-free monthly plans are available on treatments over
                  $500.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href="/appointment">Book this treatment</ButtonLink>
                  {tel ? (
                    <ButtonLink href={tel} variant="secondary">
                      Call {settings.phone}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <LeadForm
                services={services}
                defaultService={service.title}
                source={`service:${service.slug}`}
                title={`Enquire about ${service.title.toLowerCase()}`}
                description="We'll call you back within one business hour to answer your questions and find a time."
                withScheduling
              />

              {related.length > 0 ? (
                <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-ink-100">
                  <h2 className="text-base">Other treatments</h2>
                  <ul className="mt-4 grid gap-1">
                    {related.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/services/${item.slug}`}
                          className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-ink-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                            <ServiceIcon name={item.icon} className="h-[18px] w-[18px]" />
                          </span>
                          <span className="text-[0.9375rem] font-medium text-ink-800">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
