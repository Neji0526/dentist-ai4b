import type { MetadataRoute } from "next";

import { getDoctors, getPosts, getServices } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, doctors, posts] = await Promise.all([
    getServices(),
    getDoctors(),
    getPosts(200),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
      { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
      { url: absoluteUrl("/appointment"), changeFrequency: "monthly", priority: 0.9 },
      { url: absoluteUrl("/doctors"), changeFrequency: "monthly", priority: 0.8 },
      { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
      { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.7 },
      { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
      { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    ] as const
  ).map((route) => ({ ...route, lastModified: now }));

  return [
    ...staticRoutes,
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: new Date(service.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...doctors.map((doctor) => ({
      url: absoluteUrl(`/doctors/${doctor.slug}`),
      lastModified: new Date(doctor.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
