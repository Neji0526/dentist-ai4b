import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { initials } from "@/lib/format";
import type { Doctor } from "@/lib/types";

type Props = {
  title: string;
  description: string;
  note?: string;
  doctors: Doctor[];
};

/**
 * Warm closing band — a reminder that a person, not a form, is on the other
 * end. Uses real team members so the faces are not stock.
 */
export function PeopleBand({ title, description, note = "We're here for you!", doctors }: Props) {
  const faces = doctors.slice(0, 3);

  return (
    <section className="pb-4 pt-10">
      <Container width="wide">
        <div className="flex flex-col items-start gap-7 rounded-3xl bg-brand-50/60 px-6 py-8 ring-1 ring-brand-100/70 sm:px-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 ring-1 ring-brand-100">
              <ServiceIcon name="users" className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-[1.375rem] leading-tight">{title}</h2>
              <p className="mt-1.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ul className="flex items-center">
              {faces.map((doctor, index) => (
                <li
                  key={doctor.id}
                  className={`relative ${index > 0 ? "-ml-4" : ""}`}
                  style={{ zIndex: faces.length - index }}
                >
                  {doctor.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doctor.photo_url}
                      alt={doctor.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover ring-4 ring-white"
                    />
                  ) : (
                    <span
                      title={doctor.name}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-mint-100 text-sm font-semibold text-brand-700 ring-4 ring-white"
                    >
                      {initials(doctor.name)}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg italic text-ink-700">
              {note}
              <svg
                viewBox="0 0 40 24"
                className="h-6 w-10 text-brand-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M1 4c10 0 24 2 30 14" />
                <path d="M25 18l6 1 1-7" />
              </svg>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
