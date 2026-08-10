/**
 * Bundled sample content — the exact same copy as supabase/seed.sql.
 *
 * Used only when Supabase is not configured, so a fresh clone renders a
 * complete, believable site on `npm run dev`. Once you point .env.local at a
 * real project, every page reads from the database instead and none of this
 * is used.
 */
import type {
  BlogPost,
  Doctor,
  Faq,
  Lead,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

const NOW = "2026-01-01T09:00:00.000Z";

function daysAgo(days: number) {
  return new Date(Date.parse(NOW) - days * 86_400_000).toISOString();
}

const stamps = { created_at: NOW, updated_at: NOW };

export const demoSettings: SiteSettings = {
  id: 1,
  clinic_name: "Brightsmile Dental Studio",
  tagline: "Gentle, modern dentistry for the whole family",
  phone: "(512) 555-0142",
  whatsapp: "(512) 555-0142",
  email: "hello@brightsmiledental.com",
  address_line: "1420 Lamar Boulevard, Suite 210",
  city: "Austin",
  state: "TX",
  postal_code: "78704",
  map_embed_url: "https://www.google.com/maps?q=Austin,TX&output=embed",
  opening_hours: [
    { days: "Monday – Thursday", hours: "8:00 AM – 6:00 PM" },
    { days: "Friday", hours: "8:00 AM – 4:00 PM" },
    { days: "Saturday", hours: "9:00 AM – 2:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  emergency_note:
    "Dental emergency? Call us and we will see you the same day whenever possible.",
  default_meta_title: "Dentist in Austin, TX | Brightsmile Dental Studio",
  default_meta_description:
    "Looking for a dentist near you in Austin? Brightsmile Dental Studio offers teeth cleaning, dental implants and cosmetic dentistry with same-week appointments. Book online today.",
  og_image_url: null,
  facebook_url: null,
  instagram_url: null,
  google_reviews_url: "https://www.google.com/maps",
  updated_at: NOW,
};

export const demoServices: Service[] = [
  {
    id: "svc-teeth-cleaning",
    title: "Teeth Cleaning & Checkups",
    slug: "teeth-cleaning",
    short_description:
      "A thorough hygiene visit that removes plaque and tartar, plus a full exam and digital X-rays.",
    description: `A professional teeth cleaning is the single most effective way to keep your smile healthy. Your hygienist gently removes the plaque and hardened tartar that a toothbrush cannot reach, polishes the enamel, and checks your gums for early signs of disease.

Every cleaning at our dental clinic includes a complete oral exam, low-radiation digital X-rays when needed, and an oral cancer screening. We finish by walking you through exactly what we saw — in plain language, with photos on the screen next to you.

Most patients do best with a cleaning every six months. If you have not seen a dentist in a while, that is genuinely fine: we will never lecture you. We simply start where you are.`,
    image_url: null,
    icon: "sparkle",
    price_from: 89,
    duration: "45–60 minutes",
    benefits: [
      "Removes plaque and tartar a toothbrush cannot reach",
      "Catches cavities and gum disease early, while treatment is small",
      "Includes digital X-rays and an oral cancer screening",
      "Leaves your teeth visibly brighter and smoother",
    ],
    is_featured: true,
    is_published: true,
    sort_order: 10,
    meta_title: "Teeth Cleaning in Austin, TX | Brightsmile Dental Studio",
    meta_description:
      "Professional teeth cleaning and dental checkups in Austin from $89. Gentle hygienists, digital X-rays and same-week appointments. Book your cleaning online.",
    ...stamps,
  },
  {
    id: "svc-dental-implants",
    title: "Dental Implants",
    slug: "dental-implants",
    short_description:
      "A permanent, natural-looking replacement for a missing tooth — root and crown.",
    description: `A dental implant replaces a missing tooth from the root up. We place a small titanium post in the jawbone, let it fuse naturally, then attach a custom crown colour-matched to the teeth beside it. The result looks, feels and functions like your own tooth.

Unlike a bridge, an implant does not rely on the neighbouring teeth for support, and it protects the jawbone from the shrinkage that follows tooth loss. With good hygiene, implants routinely last decades.

Your consultation includes a 3D scan, a written treatment plan and a clear, itemised cost — before you commit to anything. We also offer monthly payment plans.`,
    image_url: null,
    icon: "implant",
    price_from: 1850,
    duration: "2 visits + healing time",
    benefits: [
      "Replaces the tooth root, so the jawbone stays strong",
      "Does not damage the healthy teeth next to the gap",
      "Custom crown colour-matched to your natural teeth",
      "Designed to last for decades, not years",
    ],
    is_featured: true,
    is_published: true,
    sort_order: 20,
    meta_title: "Dental Implants in Austin, TX | Brightsmile Dental Studio",
    meta_description:
      "Permanent dental implants in Austin from $1,850 with 3D planning and monthly payment plans. Free implant consultation — book online or call (512) 555-0142.",
    ...stamps,
  },
  {
    id: "svc-cosmetic",
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    short_description:
      "Veneers, bonding and smile design that stay on the right side of natural.",
    description: `Cosmetic dentistry should make people notice you, not your teeth. Our cosmetic dentist starts with a digital smile preview so you can see the proposed shape and shade before any treatment begins.

Depending on your goals we may recommend porcelain veneers, composite bonding to repair chips, gum contouring, or simply whitening and a reshape. Often the smallest option is the right one.

We are deliberately conservative about removing enamel. If a more minimal treatment will get you 90% of the way there, we will tell you.`,
    image_url: null,
    icon: "smile",
    price_from: 320,
    duration: "1–3 visits",
    benefits: [
      "See a digital preview of your new smile first",
      "Porcelain veneers, bonding and gum contouring",
      "Minimal-prep options that preserve natural enamel",
      "Shade-matched in natural daylight, not under a lamp",
    ],
    is_featured: true,
    is_published: true,
    sort_order: 30,
    meta_title: "Cosmetic Dentist in Austin, TX | Veneers & Smile Design",
    meta_description:
      "Cosmetic dentist in Austin offering porcelain veneers, bonding and smile design from $320. See a digital preview of your smile before you commit. Book a consultation.",
    ...stamps,
  },
  {
    id: "svc-whitening",
    title: "Teeth Whitening",
    slug: "teeth-whitening",
    short_description:
      "Professional in-chair whitening with several shades of change in about an hour.",
    description: `Professional whitening is stronger, faster and far more even than anything sold over the counter — and because a dentist screens you first, it is also safer for your enamel and gums.

We offer a single in-chair session of about an hour, or a custom take-home kit with trays moulded to your teeth for gradual whitening over two weeks. Many patients combine the two: one visit for the jump, trays to maintain it.

If sensitivity is a worry, say so. We use a desensitising protocol that makes whitening comfortable for the great majority of patients.`,
    image_url: null,
    icon: "sparkle",
    price_from: 249,
    duration: "60 minutes",
    benefits: [
      "Several shades brighter in a single visit",
      "Gums and enamel protected throughout",
      "Custom take-home trays to maintain the result",
      "Desensitising protocol for sensitive teeth",
    ],
    is_featured: false,
    is_published: true,
    sort_order: 40,
    meta_title: "Professional Teeth Whitening in Austin, TX | Brightsmile Dental",
    meta_description:
      "In-chair professional teeth whitening in Austin from $249. Several shades brighter in one hour, with a desensitising protocol for sensitive teeth.",
    ...stamps,
  },
  {
    id: "svc-aligners",
    title: "Invisalign & Clear Aligners",
    slug: "clear-aligners",
    short_description:
      "Straighten your teeth with a removable, nearly invisible aligner series.",
    description: `Clear aligners move your teeth gradually using a series of removable, transparent trays. There are no brackets or wires, and you take them out to eat and brush.

Treatment starts with a digital scan — no impression putty — and a simulation showing how your teeth will move month by month. Most adult cases finish in six to eighteen months.

We monitor your progress in short check-in visits and include a set of retainers at the end, because keeping the result matters as much as achieving it.`,
    image_url: null,
    icon: "aligner",
    price_from: 3400,
    duration: "6–18 months",
    benefits: [
      "Nearly invisible and fully removable",
      "Digital scan instead of impression putty",
      "See a month-by-month simulation before starting",
      "Retainers included to protect the result",
    ],
    is_featured: false,
    is_published: true,
    sort_order: 50,
    meta_title: "Invisalign & Clear Aligners in Austin, TX | Brightsmile Dental",
    meta_description:
      "Clear aligners and Invisalign in Austin from $3,400 with digital scanning, month-by-month simulation and retainers included. Book a free aligner assessment.",
    ...stamps,
  },
  {
    id: "svc-emergency",
    title: "Emergency Dental Care",
    slug: "emergency-dentist",
    short_description:
      "Same-day relief for toothache, broken teeth, swelling and lost fillings.",
    description: `Dental pain does not wait politely for an opening in the diary. We keep same-day slots free every weekday for emergencies, and we triage every call: if you need to be seen today, we will find a way.

Come to us for severe toothache, a cracked or knocked-out tooth, facial swelling, a lost filling or crown, bleeding gums, or an abscess. Our first priority is getting you out of pain; treatment planning comes after that.

If you are calling outside opening hours, our recorded message gives you the after-hours number and clear first-aid steps.`,
    image_url: null,
    icon: "shield",
    price_from: null,
    duration: "Same-day appointment",
    benefits: [
      "Same-day emergency slots kept free every weekday",
      "Pain relief first, treatment plan second",
      "Cracked, knocked-out and abscessed teeth treated",
      "Clear after-hours guidance when we are closed",
    ],
    is_featured: true,
    is_published: true,
    sort_order: 60,
    meta_title: "Emergency Dentist in Austin, TX | Same-Day Appointments",
    meta_description:
      "Emergency dentist in Austin with same-day appointments for toothache, broken teeth and swelling. Call (512) 555-0142 for immediate dental pain relief.",
    ...stamps,
  },
  {
    id: "svc-root-canal",
    title: "Root Canal Treatment",
    slug: "root-canal",
    short_description:
      "Save an infected tooth and end the pain — usually in a single visit.",
    description: `A root canal treats infection inside the tooth. We remove the inflamed pulp, disinfect and seal the canals, and restore the tooth with a filling or crown. Modern techniques and thorough anaesthetic mean the procedure itself is comfortable — most patients tell us it was far easier than they expected.

Left untreated, an infected pulp leads to abscess and eventually tooth loss. A root canal keeps your natural tooth, which is always better than replacing it.

We use rotary instrumentation and digital imaging to finish most cases in one appointment.`,
    image_url: null,
    icon: "tooth",
    price_from: 690,
    duration: "60–90 minutes",
    benefits: [
      "Ends the pain of an infected tooth",
      "Saves your natural tooth instead of extracting it",
      "Most cases completed in a single visit",
      "Thorough anaesthetic — comfort is the priority",
    ],
    is_featured: false,
    is_published: true,
    sort_order: 70,
    meta_title: "Root Canal Treatment in Austin, TX | Brightsmile Dental Studio",
    meta_description:
      "Comfortable root canal treatment in Austin from $690, usually in a single visit. Save your natural tooth and end the pain. Book an assessment today.",
    ...stamps,
  },
  {
    id: "svc-childrens",
    title: "Children's Dentistry",
    slug: "childrens-dentistry",
    short_description:
      "Friendly, unhurried dental visits that teach children to like the dentist.",
    description: `A child's first few dental visits set the tone for life. We keep them short, playful and completely pressure-free — a ride in the chair, a look with the mirror, a count of the teeth, a sticker.

Preventive care does the heavy lifting: fluoride varnish, sealants on the back teeth, and coaching on brushing that actually lands with kids. We also check how the jaw and adult teeth are developing so anything that needs orthodontics is caught early.

Parents are welcome to stay beside the chair for every appointment.`,
    image_url: null,
    icon: "child",
    price_from: 79,
    duration: "30 minutes",
    benefits: [
      "Gentle, unhurried first visits with no pressure",
      "Fluoride varnish and sealants to prevent cavities",
      "Early monitoring of jaw and adult-tooth development",
      "Parents stay beside the chair, always",
    ],
    is_featured: false,
    is_published: true,
    sort_order: 80,
    meta_title: "Children's Dentist in Austin, TX | Brightsmile Dental Studio",
    meta_description:
      "Gentle children's dentistry in Austin from $79. Friendly first visits, fluoride and sealants, and parents welcome beside the chair. Book your child's checkup.",
    ...stamps,
  },
];

export const demoDoctors: Doctor[] = [
  {
    id: "doc-marsh",
    name: "Dr. Elena Marsh",
    slug: "dr-elena-marsh",
    title: "DDS, Principal Dentist",
    photo_url: null,
    bio: `Dr. Marsh founded Brightsmile in 2013 with one rule for the practice: never rush a nervous patient. She has spent eighteen years in general and restorative dentistry, with a particular focus on implants and full-mouth rehabilitation.

Patients tend to mention two things about her — that she explains everything on the screen before she touches anything, and that she is unusually calm. She lectures locally on treating dental anxiety.

Outside the clinic she runs long distances slowly and grows more tomatoes than her family can eat.`,
    experience_years: 18,
    specialties: ["Dental Implants", "Restorative Dentistry", "Anxious Patients"],
    education: [
      "DDS, University of Texas Health Science Center",
      "Diplomate, International Congress of Oral Implantologists",
    ],
    languages: ["English", "Spanish"],
    is_published: true,
    sort_order: 10,
    ...stamps,
  },
  {
    id: "doc-okonjo",
    name: "Dr. Samuel Okonjo",
    slug: "dr-samuel-okonjo",
    title: "DMD, Cosmetic & Restorative Dentist",
    photo_url: null,
    bio: `Dr. Okonjo leads our cosmetic work. He trained in prosthodontics before moving into aesthetic dentistry, and it shows: his veneer cases are conservative, shade-matched in daylight, and built to last rather than to photograph well once.

He is a firm believer in showing patients a digital preview and letting them sit with it. "If you are not excited by the mock-up," he says, "we have not finished designing."

He plays bass, badly and enthusiastically, in a band of dentists.`,
    experience_years: 12,
    specialties: ["Porcelain Veneers", "Smile Design", "Crowns & Bridges"],
    education: [
      "DMD, Boston University",
      "Advanced Aesthetic Continuum, Kois Center",
    ],
    languages: ["English", "French"],
    is_published: true,
    sort_order: 20,
    ...stamps,
  },
  {
    id: "doc-raman",
    name: "Dr. Priya Raman",
    slug: "dr-priya-raman",
    title: "BDS, Orthodontics & Clear Aligners",
    photo_url: null,
    bio: `Dr. Raman handles our aligner and orthodontic cases for teenagers and adults. She is precise about planning — every case gets a full digital treatment simulation before the first tray goes in — and honest about what aligners can and cannot fix.

She has treated more than 600 aligner cases and still reviews each set of scans personally.

She is the person on the team most likely to be found explaining a treatment plan to a fourteen-year-old rather than to their parent, on the reasonable grounds that it is their smile.`,
    experience_years: 10,
    specialties: ["Clear Aligners", "Invisalign", "Teen Orthodontics"],
    education: [
      "BDS, University of Bristol",
      "MSc Orthodontics, King's College London",
    ],
    languages: ["English", "Hindi", "Tamil"],
    is_published: true,
    sort_order: 30,
    ...stamps,
  },
  {
    id: "doc-whitfield",
    name: "Anna Whitfield",
    slug: "anna-whitfield",
    title: "RDH, Lead Dental Hygienist",
    photo_url: null,
    bio: `Anna has been cleaning teeth in Austin for fifteen years and is the reason so many of our patients stop dreading hygiene visits. She is meticulous, gentle, and completely unshockable about how long it has been since your last cleaning.

She runs our periodontal maintenance programme and coaches patients on the small daily habits that prevent the big treatments.

Ask her about interdental brushes at your peril; she is genuinely passionate about them.`,
    experience_years: 15,
    specialties: ["Preventive Care", "Periodontal Therapy", "Nervous Patients"],
    education: [
      "RDH, Austin Community College",
      "Certified in Local Anaesthesia Administration",
    ],
    languages: ["English"],
    is_published: true,
    sort_order: 40,
    ...stamps,
  },
];

export const demoTestimonials: Testimonial[] = [
  {
    id: "tst-1",
    patient_name: "Marcus T.",
    message:
      "I had avoided dentists for eleven years out of pure fear. Dr. Marsh talked me through every single step and stopped whenever I raised a hand. Two visits later I am fully caught up and genuinely not scared any more.",
    rating: 5,
    treatment: "Teeth Cleaning",
    service_id: "svc-teeth-cleaning",
    is_published: true,
    sort_order: 10,
    ...stamps,
  },
  {
    id: "tst-2",
    patient_name: "Rachel P.",
    message:
      "Cracked a molar on a Sunday evening and they saw me first thing Monday. Out of pain within the hour, permanent crown three weeks later. No drama, no surprise bill.",
    rating: 5,
    treatment: "Emergency Care",
    service_id: "svc-emergency",
    is_published: true,
    sort_order: 20,
    ...stamps,
  },
  {
    id: "tst-3",
    patient_name: "Daniel K.",
    message:
      "I lost a front tooth in a bike accident. The implant Dr. Marsh placed is indistinguishable from the others — my own mother could not pick which one it was.",
    rating: 5,
    treatment: "Dental Implants",
    service_id: "svc-dental-implants",
    is_published: true,
    sort_order: 30,
    ...stamps,
  },
  {
    id: "tst-4",
    patient_name: "Sofia R.",
    message:
      "Dr. Okonjo showed me a digital preview of my veneers and I asked to make them smaller and less white. He agreed immediately. The result looks like my teeth, just better.",
    rating: 5,
    treatment: "Porcelain Veneers",
    service_id: "svc-cosmetic",
    is_published: true,
    sort_order: 40,
    ...stamps,
  },
  {
    id: "tst-5",
    patient_name: "James H.",
    message:
      "Fourteen months of aligners and my bottom teeth are finally straight at thirty-eight. Dr. Raman was realistic from day one about what would and would not shift.",
    rating: 5,
    treatment: "Clear Aligners",
    service_id: "svc-aligners",
    is_published: true,
    sort_order: 50,
    ...stamps,
  },
  {
    id: "tst-6",
    patient_name: "Amara O.",
    message:
      "My six-year-old asks when she can go back to the dentist. I did not think that was a sentence I would ever type.",
    rating: 5,
    treatment: "Children's Dentistry",
    service_id: "svc-childrens",
    is_published: true,
    sort_order: 60,
    ...stamps,
  },
];

export const demoFaqs: Faq[] = [
  {
    id: "faq-1",
    question: "How quickly can I get an appointment?",
    answer:
      "New patient checkups are usually available within the same week, and we hold same-day slots free every weekday for dental emergencies. Submit the appointment form and we will call you back within one business hour to confirm a time.",
    category: "Appointments",
    is_published: true,
    sort_order: 10,
    ...stamps,
  },
  {
    id: "faq-2",
    question: "Do you take my insurance?",
    answer:
      "We are in-network with most major PPO plans and file claims on your behalf. Send us a photo of your card through the contact form and we will verify your coverage and tell you your expected out-of-pocket cost before you book.",
    category: "Payment",
    is_published: true,
    sort_order: 20,
    ...stamps,
  },
  {
    id: "faq-3",
    question: "What does a teeth cleaning cost?",
    answer:
      "A standard hygiene visit starts at $89 and includes a full exam and digital X-rays where needed. If we find that you need deeper periodontal cleaning, we will quote you in writing before starting any additional treatment.",
    category: "Payment",
    is_published: true,
    sort_order: 30,
    ...stamps,
  },
  {
    id: "faq-4",
    question: "I am terrified of the dentist. What can you do?",
    answer:
      "Tell us when you book — it changes how we run your appointment. We schedule extra time, explain each step before it happens, agree a stop signal with you, and can offer numbing gel before any injection as well as sedation options for longer treatments. Roughly a third of our patients describe themselves as anxious.",
    category: "Comfort",
    is_published: true,
    sort_order: 40,
    ...stamps,
  },
  {
    id: "faq-5",
    question: "Are dental implants painful?",
    answer:
      "The placement itself is done under local anaesthetic and is usually comfortable — most patients compare it to having a filling. Expect mild soreness for two to three days afterwards, manageable with over-the-counter pain relief. We call you the evening after surgery to check on you.",
    category: "Treatments",
    is_published: true,
    sort_order: 50,
    ...stamps,
  },
  {
    id: "faq-6",
    question: "How long do dental implants last?",
    answer:
      "With good hygiene and regular checkups, implants routinely last decades and often for life. The crown attached to the implant may need replacing after fifteen to twenty years of normal wear.",
    category: "Treatments",
    is_published: true,
    sort_order: 60,
    ...stamps,
  },
  {
    id: "faq-7",
    question: "Do you offer payment plans?",
    answer:
      "Yes. We offer interest-free monthly plans on treatments over $500 and longer-term financing on larger cases such as implants and full-mouth work. We will lay out the options in writing at your consultation.",
    category: "Payment",
    is_published: true,
    sort_order: 70,
    ...stamps,
  },
  {
    id: "faq-8",
    question: "How often should I have a checkup?",
    answer:
      "Every six months suits most people. If you have gum disease, a history of frequent cavities, or you smoke, we may recommend every three to four months. Your dentist will give you a personal interval rather than a generic one.",
    category: "Appointments",
    is_published: true,
    sort_order: 80,
    ...stamps,
  },
  {
    id: "faq-9",
    question: "At what age should my child first see a dentist?",
    answer:
      "Around their first birthday, or within six months of the first tooth appearing. The early visits are mostly about familiarity rather than treatment — a look, a count, a sticker — so that the dentist never becomes something to fear.",
    category: "Children",
    is_published: true,
    sort_order: 90,
    ...stamps,
  },
  {
    id: "faq-10",
    question: "What should I do in a dental emergency?",
    answer:
      "Call us on (512) 555-0142 straight away. For a knocked-out adult tooth, hold it by the crown, rinse it gently in milk or saline, and try to reseat it in the socket — or keep it in milk — and get to us within the hour. For swelling that affects your breathing or swallowing, go to an emergency room immediately.",
    category: "Emergencies",
    is_published: true,
    sort_order: 100,
    ...stamps,
  },
];

export const demoPosts: BlogPost[] = [
  {
    id: "post-choose-dentist",
    title: "How to Choose a Dentist Near You (Without Guessing)",
    slug: "how-to-choose-a-dentist-near-you",
    excerpt:
      "Nine practical checks that separate a dental clinic you will stay with for a decade from one you will leave after two visits.",
    content: `Searching "dentist near me" gives you a map full of pins and no way to tell them apart. Distance matters, but it is the least useful of the signals available to you. Here is what we would look at if we were choosing a dental clinic for our own family.

## 1. Read the two-star reviews, not the five-star ones

Five-star reviews tell you the practice can do a routine cleaning well. The mediocre reviews tell you how the clinic behaves when something goes wrong — a delayed crown, a billing dispute, a treatment that needed redoing. That is the information you actually want.

## 2. Ask what happens in an emergency

Every practice says it welcomes emergencies. Ask the concrete version: do you keep same-day slots free, and what happens if I call at 4:30 PM on a Friday? A clinic that has thought this through will answer immediately.

## 3. Check that quotes come in writing before treatment

You should never learn the cost of your treatment from the invoice. A good dental clinic hands you an itemised plan — treatment, cost, insurance estimate, your portion — and gives you time to think about it.

## 4. Look for photographs of their own work

Not stock images. A cosmetic dentist proud of their veneers will show you cases they treated themselves, including the awkward ones.

## 5. Notice whether they explain or just tell

The best appointment you can have is one where you see your own X-rays on the screen and understand what you are looking at. If a dentist cannot explain why you need a treatment in language you follow, that is a reason to pause.

## 6. Ask about anxiety before you book

If you are nervous, say so on the phone and listen to the answer. "Don't worry, everyone says that" is a bad answer. A description of what they will actually do differently — extra time, a stop signal, numbing gel, sedation options — is a good one.

## 7. Confirm your insurance in advance

Call, or send a photo of your card, and ask for your expected out-of-pocket cost for a checkup. A practice that handles this smoothly before you are a patient will handle it smoothly afterwards.

## 8. Consider the boring logistics

Parking, evening or Saturday hours, how far in advance the next cleaning is available, whether you can reach a human on the phone. These are what determine whether you actually keep going.

## 9. Trust how the first visit felt

You will know. If you were rushed, talked over, or sold to, no amount of technology on the website makes up for it.

## A note on switching

If you already have a dentist and something feels off, you are allowed to leave. Ask for your records and X-rays — they are yours, and any practice will forward them. Nobody needs to have a difficult conversation about it.

If you are in Austin and looking, we are happy to be one of the practices you compare. Book a checkup and see how the first visit feels.`,
    cover_image_url: null,
    author_name: "Dr. Elena Marsh",
    tags: ["Choosing a dentist", "Dental clinic", "Patient guide"],
    read_minutes: 7,
    is_published: true,
    published_at: daysAgo(4),
    meta_title: "How to Choose a Dentist Near You | 9 Practical Checks",
    meta_description:
      "Nine practical checks for choosing a dentist near you — from reading the two-star reviews to confirming written quotes and emergency availability.",
    ...stamps,
  },
  {
    id: "post-cleaning-frequency",
    title: "How Often Do You Really Need a Teeth Cleaning?",
    slug: "how-often-teeth-cleaning",
    excerpt:
      "The six-month rule is a good default and a bad universal law. Here is how to work out the right interval for your mouth.",
    content: `Almost everyone has heard that you should have a teeth cleaning every six months. It is a sensible default. It is also, for a meaningful minority of people, either too often or nowhere near often enough.

## Where the six-month rule came from

It is not the result of a landmark clinical trial. Six months became the standard interval partly through convention and partly because it happens to work well for people at average risk of cavities and gum disease. For that group — good brushing, no gum disease, few fillings — twice a year genuinely is about right.

## Who needs a cleaning more often

Your dentist may recommend every three or four months if you have:

- **Active or treated gum disease.** Periodontal pockets recolonise with bacteria in roughly twelve weeks, which is why periodontal maintenance is usually set at three months.
- **A history of frequent cavities.** Repeated decay means the balance in your mouth favours the bacteria.
- **Smoking or vaping.** Both reduce gum healing and mask bleeding, so problems progress quietly.
- **Diabetes.** Gum disease and blood-sugar control worsen each other in both directions.
- **Orthodontic appliances.** Brackets and wires make plaque genuinely hard to remove at home.
- **A dry mouth,** often from medication. Saliva is your natural defence against decay.
- **Pregnancy.** Hormonal changes make gums more reactive to plaque.

## Who can safely stretch it

If you have no fillings, healthy gums that do not bleed, excellent home hygiene and no risk factors, some dentists will move you to every nine or twelve months. This should be your dentist's call based on your charts, not a decision you make to save money — the exam that comes with the cleaning is doing a lot of the work.

## What a cleaning actually does that brushing cannot

Brushing and flossing remove soft plaque. Once plaque hardens into tartar — which takes about 24 to 72 hours — no toothbrush will shift it, and its rough surface collects more plaque. Only a professional scale removes it. The hygienist also reaches under the gumline and between teeth where a brush cannot go.

The exam matters as much as the scale. Cavities caught early need a small filling; the same cavity found two years later may need a root canal and a crown. This is the entire economic argument for regular checkups.

## The honest answer

Start at six months. Ask your dentist directly, at your next visit, what interval they recommend for *you* and why. If they cannot point to something in your mouth to justify the answer, ask again.

If it has been years rather than months, book anyway. We have genuinely seen it all, and nobody at this clinic is going to make you feel bad about it.`,
    cover_image_url: null,
    author_name: "Anna Whitfield",
    tags: ["Teeth cleaning", "Preventive care", "Gum health"],
    read_minutes: 6,
    is_published: true,
    published_at: daysAgo(11),
    meta_title: "How Often Do You Need a Teeth Cleaning? | Brightsmile Dental",
    meta_description:
      "Is a teeth cleaning every six months right for you? A dental hygienist explains who needs cleanings every three months and who can safely wait longer.",
    ...stamps,
  },
  {
    id: "post-implants-vs-bridges",
    title: "Dental Implants vs Bridges: An Honest Comparison",
    slug: "dental-implants-vs-bridges",
    excerpt:
      "Both replace a missing tooth. They differ in what they cost, what they preserve, and how long they last.",
    content: `You have lost a tooth, and you have been offered two options: a dental implant or a bridge. Here is the comparison without the sales pitch, including the cases where a bridge is genuinely the better choice.

## What each one actually is

An **implant** replaces the whole tooth, root included. A titanium post is placed in the jawbone, left to fuse with it over several months, then topped with a custom crown.

A **bridge** replaces only the visible part. The teeth on either side of the gap are prepared and crowned, and a false tooth is suspended between them.

## The bone argument for implants

When a tooth root is lost, the jawbone that supported it begins to shrink — noticeably within the first year. An implant is the only option that loads the bone the way a natural root does, which preserves both the bone and the shape of your face over the long term. A bridge sits above the gum and does nothing to prevent that shrinkage.

## The cost of preparing healthy teeth

A conventional bridge requires cutting down two healthy neighbouring teeth. If those teeth are already crowned or heavily filled, that cost is close to zero — you are re-crowning something already treated, and a bridge makes obvious sense. If they are pristine, you are permanently altering two sound teeth to fix a problem with a third.

## Time, cost and longevity

An implant takes three to six months from placement to final crown; a bridge is usually finished in two to three weeks. The bridge costs less at the outset and typically lasts ten to fifteen years. The implant costs more up front, leaves the neighbouring teeth untouched, and routinely lasts decades — so a bridge replaced twice over thirty years may well cost more than one implant placed once.

Cleaning differs too: you brush and floss an implant like a normal tooth, while a bridge needs floss threaded underneath it every day.

## When a bridge is the right answer

- The adjacent teeth already need crowns.
- There is not enough bone for an implant and you would rather not have a graft.
- A medical condition or medication makes implant healing unpredictable.
- You need the gap closed quickly — a wedding, a job, a deadline.
- The cost difference is the deciding factor, which is a completely legitimate reason.

## When an implant is clearly better

- The neighbouring teeth are healthy and untouched.
- You are replacing a back tooth that takes heavy chewing load.
- You are young enough that a 10–15 year restoration means replacing it several times.
- You want the option you are least likely to revisit.

## How we decide with you

Your consultation includes a 3D scan that shows exactly how much bone you have, which often settles the question on its own. You will leave with both options quoted in writing, including the long-term replacement costs, so you can compare like with like.

Book an implant consultation and we will tell you honestly which one we would choose in your position.`,
    cover_image_url: null,
    author_name: "Dr. Elena Marsh",
    tags: ["Dental implants", "Bridges", "Missing teeth"],
    read_minutes: 8,
    is_published: true,
    published_at: daysAgo(19),
    meta_title: "Dental Implants vs Bridges: Honest Cost & Longevity Comparison",
    meta_description:
      "A dentist compares dental implants and bridges on cost, longevity, bone preservation and healthy-tooth damage — including when a bridge is the better choice.",
    ...stamps,
  },
  {
    id: "post-cosmetic-natural",
    title: "Will Cosmetic Dentistry Look Fake? How We Keep It Natural",
    slug: "will-cosmetic-dentistry-look-fake",
    excerpt:
      "The fear is reasonable and the cause is specific. Four decisions separate a natural result from an obvious one.",
    content: `The most common thing patients say in a cosmetic consultation is some version of: I want them better, but I do not want them to look done. That fear is well founded — we have all seen the result you are worried about. It comes from four specific decisions, and all four are avoidable.

## 1. Shade: too white, and uniformly so

Natural teeth are not one flat colour. They are more translucent at the biting edge, warmer near the gum, and no two are identical. The obvious giveaway of cosmetic work is a row of identical opaque rectangles in a shade brighter than the whites of your eyes.

We match shade in natural daylight, not under the surgery lamp, and we cap brightness at what suits your complexion and age. A good ceramist builds in translucency and subtle variation on purpose.

## 2. Shape: too symmetrical

Perfect bilateral symmetry reads as artificial because real faces are not symmetrical. A natural smile has slightly different lateral incisors, a canine with a little more character, edges worn in a way that matches your age.

## 3. Proportion: ignoring the face

Teeth have to fit the face they are in — lip line, the curve of the smile, how much shows at rest. This is why we design against photographs of your face rather than against a model of your teeth alone.

## 4. Doing too much

The most common overtreatment in cosmetic dentistry is ten veneers where whitening, one bonding repair and a reshape would have done it. Every veneer is a permanent commitment; enamel does not grow back. If a smaller intervention gets you most of the way, we will recommend it, even though it invoices for less.

## The preview is the whole point

Before any enamel is touched, we produce a digital mock-up of the proposed result, and in many cases a trial smile you can wear temporarily and photograph. Take it outside. Show it to someone who will be blunt with you.

If you are not genuinely pleased with the preview, the design is not finished. That is the stage to say "smaller", "less white", or "leave the canine alone" — and patients who do almost always end up happier.

## What to ask any cosmetic dentist

- Can I see cases you treated yourself, including a subtle one?
- How much enamel will you remove, and is there a lower-prep option?
- Will I see a preview before treatment begins?
- What happens if I do not like the trial smile?

Book a cosmetic consultation and start with the preview. There is no obligation to go further.`,
    cover_image_url: null,
    author_name: "Dr. Samuel Okonjo",
    tags: ["Cosmetic dentistry", "Veneers", "Smile design"],
    read_minutes: 6,
    is_published: true,
    published_at: daysAgo(27),
    meta_title: "Will Cosmetic Dentistry Look Fake? A Cosmetic Dentist Explains",
    meta_description:
      "Worried veneers will look fake? A cosmetic dentist breaks down the four decisions — shade, shape, proportion and overtreatment — that make cosmetic work obvious.",
    ...stamps,
  },
];

/** Sample leads so the admin panel is explorable in demo mode. */
export const demoLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Hannah Beck",
    phone: "(512) 555-0198",
    email: "hannah.beck@example.com",
    service: "Dental Implants",
    service_id: "svc-dental-implants",
    preferred_date: null,
    preferred_time: "Morning",
    message: "Lost a molar last year and would like to discuss an implant.",
    status: "new",
    source: "website",
    page_path: "/appointment",
    internal_notes: null,
    created_at: daysAgo(0),
    updated_at: daysAgo(0),
  },
  {
    id: "lead-2",
    name: "Owen Fletcher",
    phone: "(512) 555-0177",
    email: "owen.f@example.com",
    service: "Teeth Cleaning & Checkups",
    service_id: "svc-teeth-cleaning",
    preferred_date: null,
    preferred_time: "Late afternoon",
    message: "New to Austin, need to register with a dentist.",
    status: "contacted",
    source: "website",
    page_path: "/",
    internal_notes: "Left voicemail Tuesday morning.",
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
  },
  {
    id: "lead-3",
    name: "Priya Nair",
    phone: "(512) 555-0164",
    email: null,
    service: "Invisalign & Clear Aligners",
    service_id: "svc-aligners",
    preferred_date: null,
    preferred_time: "Saturday",
    message: "Interested in aligners for my lower teeth.",
    status: "appointment_scheduled",
    source: "website",
    page_path: "/services/clear-aligners",
    internal_notes: "Booked with Dr. Raman.",
    created_at: daysAgo(5),
    updated_at: daysAgo(3),
  },
  {
    id: "lead-4",
    name: "Tom Alvarez",
    phone: "(512) 555-0155",
    email: "t.alvarez@example.com",
    service: "Emergency Dental Care",
    service_id: "svc-emergency",
    preferred_date: null,
    preferred_time: "As soon as possible",
    message: "Cracked a tooth, quite painful.",
    status: "completed",
    source: "website",
    page_path: "/services/emergency-dentist",
    internal_notes: "Seen same day. Crown fitted.",
    created_at: daysAgo(9),
    updated_at: daysAgo(6),
  },
];
