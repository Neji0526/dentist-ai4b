/**
 * Declarative CMS configuration.
 *
 * Each entry describes a table, the fields editors can change and how the list
 * view renders. The admin list / new / edit pages and the create-update-delete
 * Server Actions are all generic over these definitions, so adding a managed
 * table means adding an object here — not another five files.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "slug"
  | "number"
  | "boolean"
  | "list"
  | "image"
  | "select"
  | "date"
  | "datetime";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** Options for `select`. */
  options?: { value: string; label: string }[];
  /** Storage bucket for `image`. */
  bucket?: string;
  /** Derive an empty `slug` from this field. */
  slugFrom?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Renders full-width in the two-column form grid. */
  wide?: boolean;
};

export type ListColumn = {
  name: string;
  label: string;
  type?: "text" | "boolean" | "date" | "number" | "badge" | "rating";
  className?: string;
};

export type Resource = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  orderBy: { column: string; ascending: boolean };
  listColumns: ListColumn[];
  fields: Field[];
  /** Public paths to revalidate after a change. */
  revalidate: (row: Record<string, unknown>) => string[];
};

const publishField: Field = {
  name: "is_published",
  label: "Published (visible on the website)",
  type: "boolean",
};

const sortField: Field = {
  name: "sort_order",
  label: "Sort order",
  type: "number",
  help: "Lower numbers appear first. Leave gaps of 10 so you can reorder later.",
  step: 1,
};

export const RESOURCES: Resource[] = [
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "service",
    description:
      "Treatments shown on the homepage, the services page and their own detail pages.",
    titleField: "title",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "title", label: "Service" },
      { name: "price_from", label: "From", type: "number" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "is_published", label: "Live", type: "boolean" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "URL slug",
        type: "slug",
        slugFrom: "title",
        help: "Appears as /services/your-slug. Leave blank to generate it.",
      },
      {
        name: "short_description",
        label: "Short description",
        type: "textarea",
        rows: 2,
        wide: true,
        help: "One or two sentences. Used on cards and in search results.",
      },
      {
        name: "description",
        label: "Full description",
        type: "markdown",
        rows: 14,
        wide: true,
        help: "Markdown: ## for headings, ** for bold, - for bullets.",
      },
      {
        name: "benefits",
        label: "Key benefits",
        type: "list",
        wide: true,
        help: "One benefit per line. Shown as a highlighted checklist.",
      },
      { name: "image_url", label: "Card image", type: "image", bucket: "services" },
      {
        name: "hero_image_url",
        label: "Hero photograph",
        type: "image",
        bucket: "services",
        help: "Shown at the top of the treatment page. Falls back to illustrated artwork when empty.",
      },
      {
        name: "badge",
        label: "Card ribbon",
        type: "select",
        help: "Small label on the services grid. Use sparingly — one or two at most.",
        options: [
          { value: "Most popular", label: "Most popular" },
          { value: "Same-day", label: "Same-day" },
          { value: "New", label: "New" },
          { value: "Free consultation", label: "Free consultation" },
        ],
      },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: [
          { value: "tooth", label: "Tooth" },
          { value: "sparkle", label: "Sparkle (cleaning / whitening)" },
          { value: "implant", label: "Implant" },
          { value: "smile", label: "Smile (cosmetic)" },
          { value: "aligner", label: "Aligner" },
          { value: "shield", label: "Shield (emergency)" },
          { value: "child", label: "Child" },
          { value: "heart", label: "Heart" },
        ],
      },
      {
        name: "price_from",
        label: "Price from (USD)",
        type: "number",
        step: 1,
        min: 0,
        help: "Leave blank to show no price.",
      },
      {
        name: "duration",
        label: "Typical duration",
        type: "text",
        placeholder: "45–60 minutes",
      },
      { name: "is_featured", label: "Feature on the homepage", type: "boolean" },
      publishField,
      sortField,
      {
        name: "meta_title",
        label: "SEO title",
        type: "text",
        wide: true,
        help: "Aim for 50–60 characters, including the city name.",
      },
      {
        name: "meta_description",
        label: "SEO description",
        type: "textarea",
        rows: 3,
        wide: true,
        help: "Aim for 140–155 characters and end with a call to action.",
      },
    ],
    revalidate: (row) => ["/", "/services", `/services/${row.slug}`],
  },
  {
    key: "doctors",
    table: "doctors",
    label: "Doctors",
    singular: "dentist",
    description: "Clinician profiles shown on the team page and in the footer.",
    titleField: "name",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "name", label: "Name" },
      { name: "title", label: "Role" },
      { name: "experience_years", label: "Years", type: "number" },
      { name: "is_published", label: "Live", type: "boolean" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "name" },
      {
        name: "title",
        label: "Role / credentials",
        type: "text",
        placeholder: "DDS, Principal Dentist",
      },
      { name: "photo_url", label: "Photo", type: "image", bucket: "doctors" },
      {
        name: "bio",
        label: "Biography",
        type: "markdown",
        rows: 12,
        wide: true,
        help: "Two or three short paragraphs. Separate them with a blank line.",
      },
      {
        name: "experience_years",
        label: "Years in practice",
        type: "number",
        step: 1,
        min: 0,
      },
      {
        name: "specialties",
        label: "Special interests",
        type: "list",
        help: "One per line. The first three appear on their card.",
      },
      { name: "education", label: "Education & training", type: "list" },
      { name: "languages", label: "Languages spoken", type: "list" },
      publishField,
      sortField,
    ],
    revalidate: (row) => ["/", "/doctors", `/doctors/${row.slug}`],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description:
      "Patient reviews. Get written permission before publishing a name.",
    titleField: "patient_name",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "patient_name", label: "Patient" },
      { name: "rating", label: "Rating", type: "rating" },
      { name: "treatment", label: "Treatment" },
      { name: "is_published", label: "Live", type: "boolean" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      {
        name: "patient_name",
        label: "Patient name",
        type: "text",
        required: true,
        help: "First name and last initial is usually the right balance.",
      },
      {
        name: "rating",
        label: "Rating (1–5)",
        type: "number",
        min: 1,
        max: 5,
        step: 1,
        required: true,
      },
      {
        name: "treatment",
        label: "Treatment",
        type: "text",
        help: "Shown under the patient's name. Should match a service title to appear on that service page.",
      },
      {
        name: "message",
        label: "Review",
        type: "textarea",
        rows: 6,
        required: true,
        wide: true,
      },
      publishField,
      sortField,
    ],
    revalidate: () => ["/", "/services"],
  },
  {
    key: "blogs",
    table: "blogs",
    label: "Blog",
    singular: "article",
    description: "Articles for organic search traffic and patient education.",
    titleField: "title",
    orderBy: { column: "published_at", ascending: false },
    listColumns: [
      { name: "title", label: "Article" },
      { name: "author_name", label: "Author" },
      { name: "published_at", label: "Published", type: "date" },
      { name: "is_published", label: "Live", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "title" },
      { name: "author_name", label: "Author", type: "text" },
      {
        name: "excerpt",
        label: "Excerpt",
        type: "textarea",
        rows: 3,
        wide: true,
        help: "Shown on cards and used as the fallback SEO description.",
      },
      {
        name: "content",
        label: "Article body",
        type: "markdown",
        rows: 22,
        wide: true,
        help: "Markdown: ## headings, ** bold, - bullets, [text](url) links.",
      },
      { name: "cover_image_url", label: "Cover image", type: "image", bucket: "blog" },
      {
        name: "tags",
        label: "Tags",
        type: "list",
        help: "One per line. The first tag is shown as the article's category.",
      },
      {
        name: "read_minutes",
        label: "Read time (minutes)",
        type: "number",
        min: 1,
        step: 1,
      },
      {
        name: "published_at",
        label: "Publish date",
        type: "datetime",
        help: "A future date keeps the article hidden until then.",
      },
      publishField,
      { name: "meta_title", label: "SEO title", type: "text", wide: true },
      {
        name: "meta_description",
        label: "SEO description",
        type: "textarea",
        rows: 3,
        wide: true,
      },
    ],
    revalidate: (row) => ["/", "/blog", `/blog/${row.slug}`],
  },
  {
    key: "faq",
    table: "faq",
    label: "FAQs",
    singular: "question",
    description:
      "Answers shown on the FAQ page, the homepage and in Google's FAQ rich results.",
    titleField: "question",
    orderBy: { column: "sort_order", ascending: true },
    listColumns: [
      { name: "question", label: "Question" },
      { name: "category", label: "Category", type: "badge" },
      { name: "is_published", label: "Live", type: "boolean" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "question", label: "Question", type: "text", required: true, wide: true },
      {
        name: "answer",
        label: "Answer",
        type: "textarea",
        rows: 6,
        required: true,
        wide: true,
        help: "Answer in 2–4 sentences. Plain text — no markdown here.",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "General", label: "General" },
          { value: "Appointments", label: "Appointments" },
          { value: "Payment", label: "Payment & insurance" },
          { value: "Treatments", label: "Treatments" },
          { value: "Comfort", label: "Comfort & anxiety" },
          { value: "Children", label: "Children" },
          { value: "Emergencies", label: "Emergencies" },
        ],
      },
      publishField,
      sortField,
    ],
    revalidate: () => ["/", "/faq", "/services"],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((resource) => resource.key === key);
}
