import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { DoctorCard } from "@/components/site/DoctorCard";
import { FeatureBar } from "@/components/site/FeatureBar";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { getDoctors, getSiteSettings } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: `Our Dentists in ${settings.city ?? "your area"}`,
    description: `Meet the dentists and hygienists at ${settings.clinic_name}. Read their qualifications, special interests and how long they have been treating patients.`,
    path: "/doctors",
    settings,
  });
}

export default async function DoctorsPage() {
  const [settings, doctors] = await Promise.all([
    getSiteSettings(),
    getDoctors(),
  ]);

  const totalYears = doctors.reduce(
    (sum, doctor) => sum + doctor.experience_years,
    0,
  );

  const credentials = [
    {
      icon: "users",
      title: "Experienced team",
      copy: `${totalYears}+ years of combined clinical experience.`,
    },
    {
      icon: "shield",
      title: "Patient first",
      copy: "We take time to listen and build a plan that is right for you.",
    },
    {
      icon: "star",
      title: "Trusted locally",
      copy: "Hundreds of five-star reviews from our community.",
    },
    {
      icon: "heart",
      title: "Continuity of care",
      copy: "You see the same familiar faces at every visit.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Our Dentists", path: "/doctors" }])} />

      <PageHeader
        eyebrow="Our team"
        title="The people who will look after your smile"
        description={`${doctors.length} clinicians, ${totalYears} years of combined experience, and a deliberately small team so you see the same familiar faces every visit.`}
        breadcrumbs={[{ name: "Our Dentists", path: "/doctors" }]}
        scene="team"
        imageAlt={`The team at ${settings.clinic_name}`}
      />

      <section className="py-12">
        <Container width="wide">
          <FeatureBar items={credentials} variant="card" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {doctors.length === 0 ? (
            <p className="rounded-2xl bg-ink-50 p-8 text-center text-ink-600">
              Our team profiles are being updated. Please call us and we will tell
              you who is available.
            </p>
          ) : null}
        </Container>
      </section>

      <CtaBand
        phone={settings.phone}
        icon="calendar"
        title="Prefer a particular dentist?"
        description="Tell us who you would like to see when you book and we will match you with them wherever the diary allows."
      />
      <div className="pb-14" />
    </>
  );
}
