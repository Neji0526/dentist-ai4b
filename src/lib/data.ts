import { cache } from "react";

import {
  demoDoctors,
  demoFaqs,
  demoPosts,
  demoServices,
  demoSettings,
  demoTestimonials,
} from "./demo-data";
import { createPublicClient } from "./supabase/public-client";
import type {
  BlogPost,
  Doctor,
  Faq,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

/**
 * Read layer for the public site.
 *
 * Every function degrades gracefully: if Supabase is not configured — or a
 * query fails — the page still renders from the bundled demo content rather
 * than showing an error. A clinic website that 500s is worse than a clinic
 * website showing slightly stale content.
 */

function warn(scope: string, error: { message: string }) {
  console.warn(`[data] ${scope} fell back to demo content: ${error.message}`);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  if (!supabase) return demoSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    warn("site_settings", error);
    return demoSettings;
  }

  return data ? { ...demoSettings, ...(data as SiteSettings) } : demoSettings;
});

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoServices;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    warn("services", error);
    return demoServices;
  }

  return (data as Service[]) ?? [];
});

export const getFeaturedServices = cache(async (limit = 6): Promise<Service[]> => {
  const services = await getServices();
  const featured = services.filter((s) => s.is_featured);
  // Fall back to the first N so the homepage grid is never sparse.
  return (featured.length > 0 ? featured : services).slice(0, limit);
});

export const getServiceBySlug = cache(
  async (slug: string): Promise<Service | null> => {
    const supabase = createPublicClient();
    if (!supabase) return demoServices.find((s) => s.slug === slug) ?? null;

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      warn(`service:${slug}`, error);
      return demoServices.find((s) => s.slug === slug) ?? null;
    }

    return (data as Service) ?? null;
  },
);

export const getDoctors = cache(async (): Promise<Doctor[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoDoctors;

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    warn("doctors", error);
    return demoDoctors;
  }

  return (data as Doctor[]) ?? [];
});

export const getDoctorBySlug = cache(
  async (slug: string): Promise<Doctor | null> => {
    const doctors = await getDoctors();
    return doctors.find((d) => d.slug === slug) ?? null;
  },
);

export const getTestimonials = cache(async (limit = 12): Promise<Testimonial[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoTestimonials.slice(0, limit);

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    warn("testimonials", error);
    return demoTestimonials.slice(0, limit);
  }

  return (data as Testimonial[]) ?? [];
});

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoFaqs;

  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    warn("faq", error);
    return demoFaqs;
  }

  return (data as Faq[]) ?? [];
});

export const getPosts = cache(async (limit = 30): Promise<BlogPost[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoPosts.slice(0, limit);

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    warn("blogs", error);
    return demoPosts.slice(0, limit);
  }

  return (data as BlogPost[]) ?? [];
});

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = createPublicClient();
    if (!supabase) return demoPosts.find((p) => p.slug === slug) ?? null;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      warn(`blog:${slug}`, error);
      return demoPosts.find((p) => p.slug === slug) ?? null;
    }

    return (data as BlogPost) ?? null;
  },
);

/** Related reading for a post detail page: same tag first, then recent. */
export async function getRelatedPosts(post: BlogPost, limit = 3) {
  const posts = (await getPosts()).filter((p) => p.slug !== post.slug);
  const sameTag = posts.filter((p) =>
    p.tags.some((tag) => post.tags.includes(tag)),
  );
  const seen = new Set<string>();
  return [...sameTag, ...posts]
    .filter((p) => !seen.has(p.slug) && seen.add(p.slug))
    .slice(0, limit);
}

export async function getTestimonialsForService(serviceId: string, limit = 2) {
  const all = await getTestimonials();
  return all.filter((t) => t.service_id === serviceId).slice(0, limit);
}
