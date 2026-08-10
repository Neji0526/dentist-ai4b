import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { Doctor } from "@/lib/types";

type Props = {
  doctor: Doctor;
  /** Drops the bio — used in the homepage row. */
  compact?: boolean;
};

function firstParagraph(bio: string | null) {
  return bio?.split(/\n{2,}/)[0] ?? null;
}

export function DoctorCard({ doctor, compact = false }: Props) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(13,31,45,0.05),0_24px_44px_-24px_rgba(13,31,45,0.28)] hover:ring-brand-200">
      <div className="flex items-center gap-4">
        <Avatar
          name={doctor.name}
          src={doctor.photo_url}
          size={56}
          rounded="card"
          className="shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-[1.125rem] leading-snug">
            <Link href={`/doctors/${doctor.slug}`} className="hover:text-brand-700">
              <span className="absolute inset-0" aria-hidden="true" />
              {doctor.name}
            </Link>
          </h3>
          {doctor.title ? (
            <p className="mt-0.5 text-[0.8125rem] font-medium text-brand-600">
              {doctor.title}
            </p>
          ) : null}
        </div>
      </div>

      {!compact && firstParagraph(doctor.bio) ? (
        <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
          {firstParagraph(doctor.bio)}
        </p>
      ) : null}

      {doctor.specialties.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {doctor.specialties.slice(0, 3).map((specialty) => (
            <li
              key={specialty}
              className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700"
            >
              {specialty}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-5 flex items-center gap-2 border-t border-ink-100 pt-4 text-sm text-ink-500">
        <ServiceIcon name="calendar" className="h-4 w-4 text-brand-500" />
        {doctor.experience_years > 0
          ? `${doctor.experience_years} years in practice`
          : "Newest member of the team"}
      </p>
    </article>
  );
}
