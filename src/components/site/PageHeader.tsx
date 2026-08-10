import Link from "next/link";
import type { ReactNode } from "react";

import { HeroMedia } from "@/components/site/HeroMedia";
import type { SceneName } from "@/components/site/ClinicScene";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";

type Crumb = { name: string; path: string };

type Props = {
  eyebrow?: string;
  title: string;
  /** Rendered on its own line in brand blue, as in the FAQ header. */
  titleAccent?: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  /** Illustrated artwork shown beside the copy. Omit for a full-width header. */
  scene?: SceneName;
  /** Real photograph, when available — overrides the illustration. */
  image?: string | null;
  imageAlt?: string;
};

export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  breadcrumbs = [],
  children,
  scene,
  image,
  imageAlt,
}: Props) {
  const hasMedia = Boolean(scene || image);

  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl"
      />

      <Container width="wide">
        <div
          className={`relative py-11 lg:py-14 ${
            hasMedia
              ? "grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.02fr)] lg:gap-14"
              : ""
          }`}
        >
          <div>
            {breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-500">
                  <li>
                    <Link href="/" className="hover:text-brand-700">
                      Home
                    </Link>
                  </li>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <li key={crumb.path} className="flex items-center gap-2">
                        <span aria-hidden="true" className="text-ink-300">
                          ›
                        </span>
                        {isLast ? (
                          <span className="font-medium text-ink-700">
                            {crumb.name}
                          </span>
                        ) : (
                          <Link href={crumb.path} className="hover:text-brand-700">
                            {crumb.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : null}

            {eyebrow ? (
              <span className="mb-4 inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-inset ring-brand-100">
                {eyebrow}
              </span>
            ) : null}

            <h1 className="max-w-xl text-[2.25rem] leading-[1.1] sm:text-[2.75rem]">
              {title}
              {titleAccent ? (
                <>
                  <br />
                  <span className="text-brand-600">{titleAccent}</span>
                </>
              ) : null}
            </h1>

            {description ? (
              <div className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
                {description}
              </div>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
          </div>

          {hasMedia ? (
            <div className="relative">
              <DotGrid
                id="header-dots"
                className="pointer-events-none absolute -right-2 top-8 hidden h-28 w-28 text-brand-200 lg:block"
              />
              <HeroMedia
                src={image}
                alt={imageAlt ?? title}
                scene={scene ?? "operatory"}
                priority
                className="relative"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
