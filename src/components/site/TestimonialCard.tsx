import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Stars";
import type { Testimonial } from "@/lib/types";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: Props) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-100">
      <Stars rating={testimonial.rating} />

      <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-700">
        “{testimonial.message}”
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
        <Avatar
          name={testimonial.patient_name}
          src={testimonial.photo_url}
          size={38}
        />
        <div>
          <p className="text-sm font-semibold text-ink-900">
            {testimonial.patient_name}
          </p>
          {testimonial.treatment ? (
            <p className="text-xs text-ink-500">{testimonial.treatment}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
