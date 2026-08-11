# Local photography

Drop real photographs in this folder and the site picks them up automatically —
no code change needed. Anything here is served from the site root, so
`public/images/appointment-hero.jpg` is available at `/images/appointment-hero.jpg`.

## Filenames the site looks for

| File                          | Where it appears                                   |
| ----------------------------- | -------------------------------------------------- |
| `appointment-hero.jpg`        | Header of the Book an appointment page             |

When the file is absent the page falls back to its illustrated scene, so the
layout never breaks. The check runs at build time — after adding a file, restart
`npm run dev` or re-run `npm run build`.

## Guidelines

- Landscape, roughly 16:10. 1600×1000 is plenty; larger is wasted bytes.
- Export JPEG at quality 80–85. Next.js handles resizing and WebP conversion.
- Real clinic photos beat stock every time — patients can tell.

## The CMS route instead

Photographs can also be set without touching files, from **Admin → Clinic & SEO**:

- **Clinic hero photograph URL** — Services and Book an appointment pages
- **Team photograph URL** — Our Dentists page

A CMS value wins over a file in this folder, so you can override per environment.
Per-treatment photos live on each service under **Admin → Services → Hero photograph**.
