import { TestimonialCard } from "@/components/site/TestimonialCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/types";

type Props = {
  testimonials: Testimonial[];
  googleReviewsUrl?: string | null;
  /** How many to show — 4 across on the homepage, 6 in a 3-column grid. */
  limit?: number;
};

export function Testimonials({ testimonials, googleReviewsUrl, limit = 4 }: Props) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our patients say"
          description="Real reviews from real patients — including a few who had not seen a dentist in over a decade."
          className="mx-auto"
        />

        <ul
          className={`mt-12 grid gap-5 sm:grid-cols-2 ${
            limit >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {testimonials.slice(0, limit).map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>

        {googleReviewsUrl ? (
          <p className="mt-8 text-center text-[0.9375rem] text-ink-600">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 hover:underline"
            >
              Read all our Google reviews →
            </a>
          </p>
        ) : null}
      </Container>
    </section>
  );
}
