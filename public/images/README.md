# Photography

Files here are served from the site root, so `public/images/patient-marcus.jpg`
is available at `/images/patient-marcus.jpg`.

## What ships in this folder

Placeholder stock photography, so the site looks finished before the practice
supplies its own. Replace all of it before launch.

| File                             | Where it appears                            |
| -------------------------------- | ------------------------------------------- |
| `patient-marcus.jpg`             | Testimonial card + hero face row            |
| `patient-rachel.jpg`             | Testimonial card + hero face row            |
| `patient-daniel.jpg`             | Testimonial card + hero face row            |
| `patient-sofia.jpg`              | Testimonial card + hero face row            |
| `blog-choosing-a-dentist.jpg`    | Article cover — "How to Choose a Dentist"   |
| `blog-teeth-cleaning.jpg`        | Article cover — "How Often… Teeth Cleaning" |
| `blog-implants-vs-bridges.jpg`   | Article cover — "Implants vs Bridges"       |
| `blog-cosmetic-dentistry.jpg`    | Article cover — "Will Cosmetic… Look Fake?" |
| `appointment-hero.jpg` (add one) | Header of the Book an appointment page      |

Source: Unsplash. The Unsplash License permits commercial use without
attribution.

## ⚠️ Replace the patient portraits before launch

`patient-*.jpg` are stock photographs of people who are **not** patients of this
practice, sitting next to named five-star reviews. Publishing them as-is
misrepresents real patients and is the kind of claim advertising regulators care
about.

Before going live, do one of these:

1. Replace each with a real photograph of that patient, with written consent, or
2. Clear the **Patient photograph** field in **Admin → Testimonials** — the card
   falls back to the patient's initials, which is honest and still looks fine.

## Adding or replacing photos

Most photographs are set through the CMS and need no code change:

- **Admin → Testimonials → Patient photograph**
- **Admin → Blog → Cover image**
- **Admin → Doctors → Photo**
- **Admin → Services → Hero photograph**
- **Admin → Clinic & SEO → Clinic hero photograph URL** (Services, Book an
  appointment) and **Team photograph URL** (Our Dentists)

A CMS value always wins over a file in this folder. `appointment-hero.jpg` is the
one file picked up by filename; when it is absent that page falls back to its
illustrated scene, so nothing breaks. That check runs at build time — after
adding the file, restart `npm run dev` or re-run `npm run build`.

## Guidelines

- Article covers: landscape 16:10, around 1200×750. Portraits: square, 256×256.
- Export JPEG at quality 80–85. Next.js handles resizing and WebP conversion.
- Real clinic photos beat stock every time — patients can tell.
