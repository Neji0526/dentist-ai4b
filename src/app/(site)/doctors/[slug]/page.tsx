import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { getDoctorBySlug, getDoctors, getServices, getSiteSettings } from "@/lib/data";
import { truncate } from "@/lib/format";
import { renderMarkdown, stripMarkdown } from "@/lib/markdown";
import { breadcrumbSchema, buildMetadata, doctorSchema } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [doctor, settings] = await Promise.all([
    getDoctorBySlug(slug),
    getSiteSettings(),
  ]);

  if (!doctor) return { title: "Dentist not found", robots: { index: false } };

  return buildMetadata({
    title: `${doctor.name} — ${doctor.title ?? "Dentist"} in ${settings.city ?? "your area"}`,
    description: truncate(
      stripMarkdown(doctor.bio) ||
        `${doctor.name} is part of the team at ${settings.clinic_name}.`,
      155,
    ),
    path: `/doctors/${doctor.slug}`,
    settings,
    image: doctor.photo_url,
  });
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-900">
        {title}
      </h2>
      <ul className="mt-3 grid gap-2 text-[0.9375rem] text-ink-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const [doctor, settings, services] = await Promise.all([
    getDoctorBySlug(slug),
    getSiteSettings(),
    getServices(),
  ]);

  if (!doctor) notFound();

  return (
    <>
      <JsonLd data={doctorSchema(doctor, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Our Dentists", path: "/doctors" },
          { name: doctor.name, path: `/doctors/${doctor.slug}` },
        ])}
      />

      <PageHeader
        eyebrow={doctor.title ?? "Our team"}
        title={doctor.name}
        breadcrumbs={[
          { name: "Our Dentists", path: "/doctors" },
          { name: doctor.name, path: `/doctors/${doctor.slug}` },
        ]}
        scene="team"
        image={doctor.photo_url}
        imageAlt={doctor.name}
      />

      <section className="py-14">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_minmax(340px,0.75fr)] lg:gap-14">
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar
                  name={doctor.name}
                  src={doctor.photo_url}
                  size={140}
                  rounded="card"
                  className="shrink-0"
                />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink-900">
                    {doctor.name}
                  </p>
                  {doctor.title ? (
                    <p className="mt-1 font-medium text-brand-600">{doctor.title}</p>
                  ) : null}
                  <p className="mt-3 text-[0.9375rem] text-ink-600">
                    {doctor.experience_years > 0
                      ? `${doctor.experience_years} years in practice`
                      : "Newest member of the team"}
                    {doctor.languages.length > 0
                      ? ` · Speaks ${doctor.languages.join(", ")}`
                      : ""}
                  </p>
                </div>
              </div>

              <div
                className="prose-clinic mt-10"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(doctor.bio) }}
              />

              <div className="mt-12 grid gap-8 rounded-2xl bg-ink-50 p-6 sm:grid-cols-2">
                <DetailList title="Special interests" items={doctor.specialties} />
                <DetailList
                  title="Education & training"
                  items={doctor.education}
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <LeadForm
                services={services}
                source={`doctor:${doctor.slug}`}
                title={`Book with ${doctor.name.split(" ").slice(0, 2).join(" ")}`}
                description="Mention any preference in your message and we'll match you with them wherever the diary allows."
                withScheduling
              />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
