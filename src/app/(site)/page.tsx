import type { Metadata } from "next";
import Link from "next/link";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { BlogCard } from "@/components/site/BlogCard";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { FeatureBar } from "@/components/site/FeatureBar";
import { Hero } from "@/components/site/Hero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { StatCards } from "@/components/site/StatCards";
import { StatRow } from "@/components/site/StatRow";
import { Testimonials } from "@/components/site/Testimonials";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getDoctors,
  getFaqs,
  getFeaturedServices,
  getPosts,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data";
import { buildMetadata, faqSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const city = settings.city ?? "your area";

  return buildMetadata({
    title:
      settings.default_meta_title ??
      `${settings.clinic_name} | Dentist in ${city}`,
    description:
      settings.default_meta_description ??
      `Looking for a dentist near you in ${city}? ${settings.clinic_name} offers teeth cleaning, dental implants and cosmetic dentistry with same-week appointments. Book online today.`,
    path: "/",
    settings,
  });
}

/** Floating card straddling the hero and the services section. */
const TRUST = [
  {
    icon: "clock",
    title: "Same-week availability",
    copy: "Emergency slots held open every weekday.",
  },
  {
    icon: "heart",
    title: "Gentle, unhurried care",
    copy: "Extra time and a stop signal for nervous patients.",
  },
  {
    icon: "tag",
    title: "Upfront pricing",
    copy: "Itemised written quotes before treatment starts.",
  },
  {
    icon: "shield",
    title: "Quality guaranteed",
    copy: "We stand behind every treatment we place.",
  },
];

const WHY_STATS = [
  { icon: "award", value: "18+", label: "Years of experience" },
  { icon: "users", value: "12,000+", label: "Happy patients" },
  { icon: "clock", value: "Same-day", label: "Emergency care" },
  { icon: "star", value: "4.9/5", label: "Average rating" },
];

const PROOF = [
  { value: "18+", label: "Years in practice" },
  { value: "12,000+", label: "Appointments a year" },
  { value: "500+", label: "Five-star reviews" },
  { value: "1 hr", label: "Typical callback time" },
];

export default async function HomePage() {
  const [settings, services, featured, doctors, testimonials, faqs, posts] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getFeaturedServices(4),
      getDoctors(),
      getTestimonials(),
      getFaqs(),
      getPosts(3),
    ]);

  const homeFaqs = faqs.slice(0, 4);
  const authorFor = (name: string | null) =>
    doctors.find((doctor) => doctor.name === name) ?? null;

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      {/* ---------------------------------------------------------------- */}
      {/* Hero + appointment form                                          */}
      {/* ---------------------------------------------------------------- */}
      <Hero
        settings={settings}
        services={services}
        doctors={doctors}
        reviewCount={500}
        patientCount="12,000+"
      />

      <FeatureBar items={TRUST} variant="floating" />

      {/* ---------------------------------------------------------------- */}
      {/* Services                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="pb-20 pt-16" id="services">
        <Container width="wide">
          <SectionHeading
            eyebrow="Our services"
            title="How we can help you"
            description="From a routine teeth cleaning to full implant restoration, all under one roof."
            className="mx-auto"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index < 4}
                compact
                showMeta={false}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink href="/services" variant="secondary" size="lg">
              View all {services.length} services
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why choose us                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-brand-50/50 py-20">
        <Container width="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Why choose us"
                title="Care You Can Trust"
                description="We combine careful clinical work with honest advice — explained in plain language, quoted in writing, and never rushed."
                className="mx-0"
              />
              <div className="mt-8">
                <ButtonLink href="/doctors" size="lg">
                  Meet the dentists
                </ButtonLink>
              </div>
            </div>

            <StatCards stats={WHY_STATS} />
          </div>

          <StatRow stats={PROOF} className="mt-16" />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Testimonials                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Testimonials
        testimonials={testimonials}
        googleReviewsUrl={settings.google_reviews_url}
        limit={4}
      />

      <BeforeAfter />

      {/* ---------------------------------------------------------------- */}
      {/* Conversion band                                                  */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        phone={settings.phone}
        icon={null}
        title="Need a dentist today?"
        description="Call us now or request an appointment online — we'll confirm within one business hour."
      />

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            className="mx-auto"
          />

          <div className="mt-10">
            <FaqAccordion faqs={homeFaqs} />
          </div>

          <p className="mt-6 text-center text-[0.9375rem] text-ink-600">
            <Link
              href="/faq"
              className="font-semibold text-brand-600 hover:underline"
            >
              Read all {faqs.length} questions →
            </Link>
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Latest articles                                                  */}
      {/* ---------------------------------------------------------------- */}
      {posts.length > 0 ? (
        <section className="bg-brand-50/50 py-20">
          <Container width="wide">
            <SectionHeading
              eyebrow="Latest articles"
              title="Dental tips & news"
              description="Practical advice from our dentists and hygienists."
              className="mx-auto"
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  author={authorFor(post.author_name)}
                  showAuthor={false}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <ButtonLink href="/blog" variant="secondary" size="lg">
                Read the blog
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
