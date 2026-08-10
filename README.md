# Brightsmile Dental Studio — lead generation website + CMS

A complete dental clinic website built to do one job: turn visitors into booked
appointments. Every page has a call button and an appointment form within reach,
and everything a receptionist needs to manage content and follow up on enquiries
lives in a built-in admin panel.

- **Frontend** — Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- **Backend** — Supabase (Postgres, Auth, Storage, Row Level Security)
- **Rendering** — public pages are static/SSG; the admin panel is server-rendered
  per request

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The site **runs immediately with no database**. With the Supabase variables in
`.env.local` left blank it renders from the bundled sample content in
`src/lib/demo-data.ts`, and appointment submissions are logged to the server
console instead of being saved. That makes it easy to review the design before
committing to any infrastructure.

## Connecting Supabase

### 1. Create a project

At [supabase.com](https://supabase.com) create a new project and keep the
database password somewhere safe.

### 2. Create the schema

In the Supabase **SQL Editor**, run these two files in order:

| File | What it does |
| --- | --- |
| `supabase/migrations/0001_init.sql` | Tables, enums, indexes, triggers, RLS policies, storage buckets |
| `supabase/seed.sql` | Starter content — 8 services, 4 clinicians, 6 reviews, 10 FAQs, 4 blog posts, clinic details |

Both are safe to re-run. `0002_design_update.sql` exists only for databases created
before the richer page designs landed — everything in it is already folded into
`0001_init.sql`, so a fresh install can skip it.

### 3. Add your keys

Copy the URL and anon key from **Project Settings → API** into `.env.local`:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart the dev server. Every page now reads from your database.

`NEXT_PUBLIC_SITE_URL` matters for SEO — it produces the canonical URLs, the
sitemap and the Open Graph tags. Set it to your real domain in production.

### 4. Create your admin login

There is deliberately no public sign-up.

1. **Authentication → Users → Add user** — set an email and password, and tick
   *Auto Confirm User*.
2. A `profiles` row is created automatically with the `staff` role. Promote it in
   the SQL Editor:

```sql
update public.profiles
   set role = 'admin'
 where email = 'you@example.com';
```

3. Sign in at <http://localhost:3000/admin>.

---

## The admin panel

`/admin` — server-rendered, `noindex`, and blocked in `robots.txt`.

| Screen | What it does |
| --- | --- |
| **Dashboard** | New-enquiry count, 7-day volume, enquiry→appointment conversion, latest leads |
| **Leads** | Filter by status, search by name/phone/email, click-to-call, status changes, private notes |
| **Services / Doctors / Testimonials / Blog / FAQs** | Full create, edit, delete, publish/unpublish, reordering, image upload, card ribbons ("Most popular"), per-page SEO fields |
| **Clinic & SEO** | Name, phone, address, opening hours, map embed, hero photograph, default meta title/description, Facebook / Instagram / Yelp / Google links |

Content edits call `revalidatePath()` for the affected public pages, so changes
appear on the live site without a redeploy.

### Adding another managed table

The list, create and edit screens plus the CRUD Server Actions are all generic.
To manage a new table, add one entry to `RESOURCES` in
`src/lib/admin/resources.ts` describing its fields — no new pages required.

### Images and hero artwork

Uploads go to the public Supabase Storage buckets `services`, `doctors` and
`blog`. Public read is open; writes require the admin role. Editors can also
paste an external image URL instead of uploading.

Every inner page is designed around a hero photograph. Until the practice
supplies its own, `src/components/site/ClinicScene.tsx` draws an on-brand vector
scene in its place — a treatment room, reception, a tooth model, a hygiene
counter and the team. Nothing looks unfinished, and swapping in real photography
needs no code:

| Where | Field |
| --- | --- |
| Services + appointment headers | **Clinic & SEO → Clinic hero photograph URL** |
| A single treatment page | **Services → Hero photograph** |
| Doctor profile header | **Doctors → Photo** |
| Blog post header | **Blog → Cover image** |

Doctor and patient avatars fall back to initials on a soft gradient, so team
rows and bylines hold their layout before any photos exist.

---

## Security model

The database is the source of truth for access, not the UI.

- **Public content** (`services`, `doctors`, `testimonials`, `faq`, `blogs`) is
  readable by anonymous visitors only where `is_published` is true. Blog posts
  additionally stay hidden until `published_at` has passed.
- **Leads and newsletter subscribers are write-only for the public.** The
  anonymous role can `INSERT` but has no `SELECT` policy, so a leaked anon key
  cannot be used to read patient enquiries or the mailing list back out.
- **Everything else requires the admin role**, checked by the `is_admin()`
  security-definer function against `profiles.role`.
- Users can edit their own profile but a trigger blocks them from granting
  themselves a role.
- The service-role key is never imported into client code — `service-client.ts`
  is marked `server-only`.
- The middleware refreshes sessions and redirects signed-out visitors away from
  `/admin`; the layout then verifies the admin role. Both are defence in depth
  on top of RLS.
- CMS long-form fields are rendered through `src/lib/markdown.ts`, which
  HTML-escapes input *before* applying markdown, so raw HTML in content can
  never execute. Link targets are restricted to `http(s):`, `mailto:`, `tel:`
  and site-relative paths.
- The appointment form carries a honeypot field and a per-IP rate limit
  (5 submissions / 10 minutes). Put Cloudflare Turnstile or a WAF in front of
  `/api/leads` if you attract determined spam.

---

## Lead capture

Forms appear in the hero, on every service page, on each doctor profile, in blog
sidebars, and on the contact and appointment pages. Each one is tagged with a
`source` and the originating `page_path`, so the CMS shows you which placements
actually convert.

Submissions go through a Server Action (`src/app/actions/lead.ts`), so the form
works before JavaScript has hydrated. There is also a JSON endpoint for
integrations:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phone":"(512) 555-0142","service":"Dental Implants"}'
```

Responses: `201` created · `422` validation failed (with per-field messages) ·
`429` rate limited.

Lead statuses are `new` → `contacted` → `appointment_scheduled` → `completed`.

The blog's newsletter block posts to a separate Server Action and stores signups
in `subscribers`, deduplicated case-insensitively — a repeat signup is reported
back as success rather than an error.

Blog filtering is URL-driven (`/blog?tag=Dental%20implants&q=veneers`), so
category pills and the search box cost no client JavaScript and every filtered
view is linkable and shareable.

---

## SEO

- Per-page `<title>`, meta description and canonical URL; service, doctor and
  blog pages take theirs from the CMS with sensible fallbacks
- JSON-LD: `Dentist` (with `openingHoursSpecification` and a service
  `OfferCatalog`), `FAQPage`, `MedicalProcedure`, `Physician`, `BlogPosting`,
  `BreadcrumbList`
- `sitemap.xml` generated from the database, `robots.txt` excluding `/admin`
  and `/api`
- Seed copy targets local intent — "dentist near me", "dental clinic", "teeth
  cleaning", "dental implants", "cosmetic dentist"

Replace the placeholder clinic name, phone number, address and testimonials with
the practice's real details before launch. **Patient reviews and before/after
photographs need written consent**, and the privacy policy in `/privacy` is a
template that should be reviewed against HIPAA and your state's requirements.

---

## Project layout

```
src/
├── app/
│   ├── (site)/              Public pages — home, services, doctors, blog, faq,
│   │                        contact, appointment, privacy
│   ├── admin/
│   │   ├── login/           Sign-in (outside the auth guard)
│   │   ├── (dashboard)/     Guarded CMS — dashboard, leads, content, settings
│   │   └── actions.ts       CRUD + lead Server Actions
│   ├── actions/lead.ts      Public appointment-form action
│   ├── api/leads/           JSON endpoint for integrations
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx           Fonts, metadata base
├── components/
│   ├── site/                Navbar, Footer, Hero, PageHeader, ClinicScene,
│   │                        ServiceCard, DoctorCard, BlogCard, BlogFilters,
│   │                        LeadForm, FeatureBar, CtaBand, PeopleBand,
│   │                        NewsletterBand, StatStrip, Testimonials, …
│   ├── admin/               Sidebar, ResourceForm, ImageField, LeadWorkspace, …
│   └── ui/                  Button, Container, SectionHeading, Stars, DotGrid,
│                            Avatar, ServiceIcon (shared 25-icon line set)
├── lib/
│   ├── data.ts              Public read layer (falls back to demo content)
│   ├── leads.ts             Lead insert + rate limiting
│   ├── seo.ts               Metadata builders and JSON-LD
│   ├── markdown.ts          Escape-first markdown renderer
│   ├── admin/resources.ts   CMS field definitions
│   └── supabase/            Public, browser, server and service-role clients
├── middleware.ts            Session refresh + /admin gate
└── supabase/
    ├── migrations/0001_init.sql
    ├── migrations/0002_design_update.sql
    └── seed.sql
```

Every inner page is assembled from the same set of bands — `PageHeader` with
hero artwork, content, `FeatureBar`, `CtaBand`, `PeopleBand` — so the pages read
as one system and a new page needs no new layout code.

### Landing page structure

The homepage runs in this order, each block a component you can reorder or drop
in `src/app/(site)/page.tsx`:

1. **`Hero`** — headline, benefit checklist, call + book CTAs, social proof
   (avatar stack, rating, review count) and the appointment form card with a
   response-time footnote
2. **`FeatureBar variant="floating"`** — the white reassurance card straddling
   the hero and the section below it
3. **Services** — four cards, deliberately without the price line so the grid
   stays scannable (prices still show on `/services`, via `showMeta`)
4. **Why choose us** — copy and CTA beside a 2×2 `StatCards` grid, closed by a
   divided `StatRow`
5. **`Testimonials`** — four reviews across
6. **`BeforeAfter`** — smile gallery, kept because the brief lists before/after
   under trust signals
7. **`CtaBand icon={null}`** — text-left, buttons-right conversion band
8. **FAQ** — four questions, linking through to the full list
9. **Latest articles** — three posts with a date + read-more footer
   (`showAuthor={false}`)

## Design

Light theme only — `color-scheme: light` is pinned and there is no dark variant,
by design for a medical setting. Tokens live in `src/app/globals.css`: soft blue
(`brand-*`) for trust and primary actions, medical green (`mint-*`) for
confirmation and health cues, and a warm-neutral ink scale for type. Headings
use Plus Jakarta Sans, body copy Inter.

Doctor photos, service images and blog covers all degrade gracefully — initials
avatars and illustrated scenes — so the layout never breaks before real
photography is uploaded.

Icons come from one hand-drawn set in `ui/ServiceIcon.tsx`: a single 24-unit
grid at 1.6 stroke weight, so service cards, feature bars, FAQ categories and
contact cards all look like they came from the same pen.

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

On Windows a running dev server keeps a lock on `.next`, which makes a
concurrent build fail with `EPERM`. Either stop the dev server first, or build to
a separate directory:

```bash
NEXT_BUILD_DIR=.next-build npm run build
```

## Deploying

Works on any Node host; Vercel needs no configuration. Set `NEXT_PUBLIC_SITE_URL`
to the production domain along with the two Supabase variables, and add the
domain to **Authentication → URL Configuration** in Supabase.

Node 22 or later is recommended — `@supabase/supabase-js` prints a deprecation
warning on Node 20.
