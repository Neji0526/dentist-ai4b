import type { Metadata } from "next";

import type { BlogPost, Doctor, Faq, Service, SiteSettings } from "./types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  settings: SiteSettings;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  noIndex?: boolean;
};

/** Single place where page-level metadata is assembled. */
export function buildMetadata({
  title,
  description,
  path,
  settings,
  image,
  type = "website",
  publishedTime,
  noIndex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? settings.og_image_url ?? null;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: settings.clinic_name,
      locale: "en_US",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function fullAddress(settings: SiteSettings) {
  return [
    settings.address_line,
    settings.city,
    [settings.state, settings.postal_code].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Maps our free-text opening hours to schema.org openingHoursSpecification.
 * Anything we cannot parse is simply omitted rather than guessed at.
 */
const DAY_MAP: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function to24Hour(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2] ?? "00"}`;
}

function expandDays(label: string): string[] {
  const parts = label.split(/–|-|to/i).map((p) => p.trim().toLowerCase());
  const names = Object.keys(DAY_MAP);

  if (parts.length === 2 && DAY_MAP[parts[0]] && DAY_MAP[parts[1]]) {
    const start = names.indexOf(parts[0]);
    const end = names.indexOf(parts[1]);
    if (start <= end) return names.slice(start, end + 1).map((d) => DAY_MAP[d]);
  }

  return label
    .split(/,|&/)
    .map((p) => DAY_MAP[p.trim().toLowerCase()])
    .filter(Boolean);
}

function openingHoursSpecification(settings: SiteSettings) {
  return settings.opening_hours.flatMap((entry) => {
    const days = expandDays(entry.days);
    const [openRaw, closeRaw] = entry.hours.split(/–|-/).map((p) => p?.trim());
    const opens = openRaw ? to24Hour(openRaw) : null;
    const closes = closeRaw ? to24Hour(closeRaw) : null;

    if (days.length === 0 || !opens || !closes) return [];

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens,
        closes,
      },
    ];
  });
}

/** LocalBusiness / Dentist markup — the backbone of local SEO. */
export function dentistSchema(settings: SiteSettings, services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: settings.clinic_name,
    description: settings.default_meta_description ?? settings.tagline ?? undefined,
    url: SITE_URL,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_line ?? undefined,
      addressLocality: settings.city ?? undefined,
      addressRegion: settings.state ?? undefined,
      postalCode: settings.postal_code ?? undefined,
      addressCountry: "US",
    },
    areaServed: settings.city ? { "@type": "City", name: settings.city } : undefined,
    openingHoursSpecification: openingHoursSpecification(settings),
    sameAs: [settings.facebook_url, settings.instagram_url].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalProcedure",
          name: service.title,
          url: absoluteUrl(`/services/${service.slug}`),
        },
        ...(service.price_from != null
          ? { price: service.price_from, priceCurrency: "USD" }
          : {}),
      })),
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceSchema(service: Service, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.short_description ?? undefined,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "Dentist",
      name: settings.clinic_name,
      "@id": `${SITE_URL}/#clinic`,
    },
  };
}

export function doctorSchema(doctor: Doctor, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    jobTitle: doctor.title ?? undefined,
    url: absoluteUrl(`/doctors/${doctor.slug}`),
    image: doctor.photo_url ?? undefined,
    knowsAbout: doctor.specialties,
    worksFor: {
      "@type": "Dentist",
      name: settings.clinic_name,
      "@id": `${SITE_URL}/#clinic`,
    },
  };
}

export function articleSchema(post: BlogPost, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    image: post.cover_image_url ?? undefined,
    author: {
      "@type": "Person",
      name: post.author_name ?? settings.clinic_name,
    },
    publisher: {
      "@type": "Organization",
      name: settings.clinic_name,
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
