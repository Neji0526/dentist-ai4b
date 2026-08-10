/**
 * Hand-maintained mirror of supabase/migrations/0001_init.sql.
 * If you change the schema, change this file in the same commit.
 */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "appointment_scheduled",
  "completed",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  appointment_scheduled: "Appointment Scheduled",
  completed: "Completed",
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  hero_image_url: string | null;
  icon: string | null;
  badge: string | null;
  price_from: number | null;
  duration: string | null;
  benefits: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Doctor = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  photo_url: string | null;
  bio: string | null;
  experience_years: number;
  specialties: string[];
  education: string[];
  languages: string[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  patient_name: string;
  message: string;
  rating: number;
  treatment: string | null;
  service_id: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  tags: string[];
  read_minutes: number;
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  service_id: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: LeadStatus;
  source: string | null;
  page_path: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OpeningHour = { days: string; hours: string };

export type SiteSettings = {
  id: number;
  clinic_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  map_embed_url: string | null;
  opening_hours: OpeningHour[];
  emergency_note: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  og_image_url: string | null;
  hero_image_url: string | null;
  team_image_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  yelp_url: string | null;
  google_reviews_url: string | null;
  updated_at: string;
};

export type LeadStats = {
  total: number;
  new_count: number;
  contacted_count: number;
  scheduled_count: number;
  completed_count: number;
  last_7_days: number;
  last_30_days: number;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "staff";
  created_at: string;
  updated_at: string;
};

export type NewLead = {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  service_id?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  source?: string | null;
  page_path?: string | null;
};

export type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  is_active: boolean;
  created_at: string;
};
