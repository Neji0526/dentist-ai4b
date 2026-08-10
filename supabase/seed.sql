-- ===========================================================================
-- Brightsmile Dental — starter content
-- Run after 0001_init.sql. Safe to re-run (upserts on slug / id).
-- Replace the clinic name, phone, address and copy with the real practice's.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Clinic profile + default SEO
-- ---------------------------------------------------------------------------
insert into public.site_settings (
  id, clinic_name, tagline, phone, whatsapp, email,
  address_line, city, state, postal_code, map_embed_url,
  opening_hours, emergency_note,
  default_meta_title, default_meta_description,
  facebook_url, instagram_url, yelp_url, google_reviews_url
) values (
  1,
  'Brightsmile Dental Studio',
  'Gentle, modern dentistry for the whole family',
  '(512) 555-0142',
  '(512) 555-0142',
  'hello@brightsmiledental.com',
  '1420 Lamar Boulevard, Suite 210',
  'Austin',
  'TX',
  '78704',
  'https://www.google.com/maps?q=Austin,TX&output=embed',
  '[
    {"days": "Monday – Thursday", "hours": "8:00 AM – 6:00 PM"},
    {"days": "Friday",            "hours": "8:00 AM – 4:00 PM"},
    {"days": "Saturday",          "hours": "9:00 AM – 2:00 PM"},
    {"days": "Sunday",            "hours": "Closed"}
  ]'::jsonb,
  'Dental emergency? Call us and we will see you the same day whenever possible.',
  'Dentist in Austin, TX | Brightsmile Dental Studio',
  'Looking for a dentist near you in Austin? Brightsmile Dental Studio offers teeth cleaning, dental implants and cosmetic dentistry with same-week appointments. Book online today.',
  'https://www.facebook.com/',
  'https://www.instagram.com/',
  'https://www.yelp.com/',
  'https://www.google.com/maps'
)
on conflict (id) do update set
  clinic_name              = excluded.clinic_name,
  tagline                  = excluded.tagline,
  phone                    = excluded.phone,
  whatsapp                 = excluded.whatsapp,
  email                    = excluded.email,
  address_line             = excluded.address_line,
  city                     = excluded.city,
  state                    = excluded.state,
  postal_code              = excluded.postal_code,
  map_embed_url            = excluded.map_embed_url,
  opening_hours            = excluded.opening_hours,
  emergency_note           = excluded.emergency_note,
  default_meta_title       = excluded.default_meta_title,
  default_meta_description = excluded.default_meta_description;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
insert into public.services
  (title, slug, short_description, description, icon, price_from, duration,
   benefits, badge, is_featured, sort_order, meta_title, meta_description)
values
(
  'Teeth Cleaning & Checkups',
  'teeth-cleaning',
  'A thorough hygiene visit that removes plaque and tartar, plus a full exam and digital X-rays.',
  'A professional teeth cleaning is the single most effective way to keep your smile healthy. Your hygienist gently removes the plaque and hardened tartar that a toothbrush cannot reach, polishes the enamel, and checks your gums for early signs of disease.

Every cleaning at our dental clinic includes a complete oral exam, low-radiation digital X-rays when needed, and an oral cancer screening. We finish by walking you through exactly what we saw — in plain language, with photos on the screen next to you.

Most patients do best with a cleaning every six months. If you have not seen a dentist in a while, that is genuinely fine: we will never lecture you. We simply start where you are.',
  'sparkle', 89, '45–60 minutes',
  array[
    'Removes plaque and tartar a toothbrush cannot reach',
    'Catches cavities and gum disease early, while treatment is small',
    'Includes digital X-rays and an oral cancer screening',
    'Leaves your teeth visibly brighter and smoother'
  ],
  null, true, 10,
  'Teeth Cleaning in Austin, TX | Brightsmile Dental Studio',
  'Professional teeth cleaning and dental checkups in Austin from $89. Gentle hygienists, digital X-rays and same-week appointments. Book your cleaning online.'
),
(
  'Dental Implants',
  'dental-implants',
  'A permanent, natural-looking replacement for a missing tooth — root and crown.',
  'A dental implant replaces a missing tooth from the root up. We place a small titanium post in the jawbone, let it fuse naturally, then attach a custom crown colour-matched to the teeth beside it. The result looks, feels and functions like your own tooth.

Unlike a bridge, an implant does not rely on the neighbouring teeth for support, and it protects the jawbone from the shrinkage that follows tooth loss. With good hygiene, implants routinely last decades.

Your consultation includes a 3D scan, a written treatment plan and a clear, itemised cost — before you commit to anything. We also offer monthly payment plans.',
  'implant', 1850, '2 visits + healing time',
  array[
    'Replaces the tooth root, so the jawbone stays strong',
    'Does not damage the healthy teeth next to the gap',
    'Custom crown colour-matched to your natural teeth',
    'Designed to last for decades, not years'
  ],
  null, true, 20,
  'Dental Implants in Austin, TX | Brightsmile Dental Studio',
  'Permanent dental implants in Austin from $1,850 with 3D planning and monthly payment plans. Free implant consultation — book online or call (512) 555-0142.'
),
(
  'Cosmetic Dentistry',
  'cosmetic-dentistry',
  'Veneers, bonding and smile design that stay on the right side of natural.',
  'Cosmetic dentistry should make people notice you, not your teeth. Our cosmetic dentist starts with a digital smile preview so you can see the proposed shape and shade before any treatment begins.

Depending on your goals we may recommend porcelain veneers, composite bonding to repair chips, gum contouring, or simply whitening and a reshape. Often the smallest option is the right one.

We are deliberately conservative about removing enamel. If a more minimal treatment will get you 90% of the way there, we will tell you.',
  'smile', 320, '1–3 visits',
  array[
    'See a digital preview of your new smile first',
    'Porcelain veneers, bonding and gum contouring',
    'Minimal-prep options that preserve natural enamel',
    'Shade-matched in natural daylight, not under a lamp'
  ],
  null, true, 30,
  'Cosmetic Dentist in Austin, TX | Veneers & Smile Design',
  'Cosmetic dentist in Austin offering porcelain veneers, bonding and smile design from $320. See a digital preview of your smile before you commit. Book a consultation.'
),
(
  'Teeth Whitening',
  'teeth-whitening',
  'Professional in-chair whitening with several shades of change in about an hour.',
  'Professional whitening is stronger, faster and far more even than anything sold over the counter — and because a dentist screens you first, it is also safer for your enamel and gums.

We offer a single in-chair session of about an hour, or a custom take-home kit with trays moulded to your teeth for gradual whitening over two weeks. Many patients combine the two: one visit for the jump, trays to maintain it.

If sensitivity is a worry, say so. We use a desensitising protocol that makes whitening comfortable for the great majority of patients.',
  'sparkle', 249, '60 minutes',
  array[
    'Several shades brighter in a single visit',
    'Gums and enamel protected throughout',
    'Custom take-home trays to maintain the result',
    'Desensitising protocol for sensitive teeth'
  ],
  null, false, 40,
  'Professional Teeth Whitening in Austin, TX | Brightsmile Dental',
  'In-chair professional teeth whitening in Austin from $249. Several shades brighter in one hour, with a desensitising protocol for sensitive teeth.'
),
(
  'Invisalign & Clear Aligners',
  'clear-aligners',
  'Straighten your teeth with a removable, nearly invisible aligner series.',
  'Clear aligners move your teeth gradually using a series of removable, transparent trays. There are no brackets or wires, and you take them out to eat and brush.

Treatment starts with a digital scan — no impression putty — and a simulation showing how your teeth will move month by month. Most adult cases finish in six to eighteen months.

We monitor your progress in short check-in visits and include a set of retainers at the end, because keeping the result matters as much as achieving it.',
  'aligner', 3400, '6–18 months',
  array[
    'Nearly invisible and fully removable',
    'Digital scan instead of impression putty',
    'See a month-by-month simulation before starting',
    'Retainers included to protect the result'
  ],
  'Most popular', false, 50,
  'Invisalign & Clear Aligners in Austin, TX | Brightsmile Dental',
  'Clear aligners and Invisalign in Austin from $3,400 with digital scanning, month-by-month simulation and retainers included. Book a free aligner assessment.'
),
(
  'Emergency Dental Care',
  'emergency-dentist',
  'Same-day relief for toothache, broken teeth, swelling and lost fillings.',
  'Dental pain does not wait politely for an opening in the diary. We keep same-day slots free every weekday for emergencies, and we triage every call: if you need to be seen today, we will find a way.

Come to us for severe toothache, a cracked or knocked-out tooth, facial swelling, a lost filling or crown, bleeding gums, or an abscess. Our first priority is getting you out of pain; treatment planning comes after that.

If you are calling outside opening hours, our recorded message gives you the after-hours number and clear first-aid steps.',
  'shield', null, 'Same-day appointment',
  array[
    'Same-day emergency slots kept free every weekday',
    'Pain relief first, treatment plan second',
    'Cracked, knocked-out and abscessed teeth treated',
    'Clear after-hours guidance when we are closed'
  ],
  'Same-day', true, 60,
  'Emergency Dentist in Austin, TX | Same-Day Appointments',
  'Emergency dentist in Austin with same-day appointments for toothache, broken teeth and swelling. Call (512) 555-0142 for immediate dental pain relief.'
),
(
  'Root Canal Treatment',
  'root-canal',
  'Save an infected tooth and end the pain — usually in a single visit.',
  'A root canal treats infection inside the tooth. We remove the inflamed pulp, disinfect and seal the canals, and restore the tooth with a filling or crown. Modern techniques and thorough anaesthetic mean the procedure itself is comfortable — most patients tell us it was far easier than they expected.

Left untreated, an infected pulp leads to abscess and eventually tooth loss. A root canal keeps your natural tooth, which is always better than replacing it.

We use rotary instrumentation and digital imaging to finish most cases in one appointment.',
  'tooth', 690, '60–90 minutes',
  array[
    'Ends the pain of an infected tooth',
    'Saves your natural tooth instead of extracting it',
    'Most cases completed in a single visit',
    'Thorough anaesthetic — comfort is the priority'
  ],
  null, false, 70,
  'Root Canal Treatment in Austin, TX | Brightsmile Dental Studio',
  'Comfortable root canal treatment in Austin from $690, usually in a single visit. Save your natural tooth and end the pain. Book an assessment today.'
),
(
  'Children''s Dentistry',
  'childrens-dentistry',
  'Friendly, unhurried dental visits that teach children to like the dentist.',
  'A child''s first few dental visits set the tone for life. We keep them short, playful and completely pressure-free — a ride in the chair, a look with the mirror, a count of the teeth, a sticker.

Preventive care does the heavy lifting: fluoride varnish, sealants on the back teeth, and coaching on brushing that actually lands with kids. We also check how the jaw and adult teeth are developing so anything that needs orthodontics is caught early.

Parents are welcome to stay beside the chair for every appointment.',
  'child', 79, '30 minutes',
  array[
    'Gentle, unhurried first visits with no pressure',
    'Fluoride varnish and sealants to prevent cavities',
    'Early monitoring of jaw and adult-tooth development',
    'Parents stay beside the chair, always'
  ],
  null, false, 80,
  'Children''s Dentist in Austin, TX | Brightsmile Dental Studio',
  'Gentle children''s dentistry in Austin from $79. Friendly first visits, fluoride and sealants, and parents welcome beside the chair. Book your child''s checkup.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Doctors
-- ---------------------------------------------------------------------------
insert into public.doctors
  (name, slug, title, bio, experience_years, specialties, education, languages, sort_order)
values
(
  'Dr. Elena Marsh',
  'dr-elena-marsh',
  'DDS, Principal Dentist',
  'Dr. Marsh founded Brightsmile in 2013 with one rule for the practice: never rush a nervous patient. She has spent eighteen years in general and restorative dentistry, with a particular focus on implants and full-mouth rehabilitation.

Patients tend to mention two things about her — that she explains everything on the screen before she touches anything, and that she is unusually calm. She lectures locally on treating dental anxiety.

Outside the clinic she runs long distances slowly and grows more tomatoes than her family can eat.',
  18,
  array['Dental Implants', 'Restorative Dentistry', 'Anxious Patients'],
  array['DDS, University of Texas Health Science Center', 'Diplomate, International Congress of Oral Implantologists'],
  array['English', 'Spanish'],
  10
),
(
  'Dr. Samuel Okonjo',
  'dr-samuel-okonjo',
  'DMD, Cosmetic & Restorative Dentist',
  'Dr. Okonjo leads our cosmetic work. He trained in prosthodontics before moving into aesthetic dentistry, and it shows: his veneer cases are conservative, shade-matched in daylight, and built to last rather than to photograph well once.

He is a firm believer in showing patients a digital preview and letting them sit with it. "If you are not excited by the mock-up," he says, "we have not finished designing."

He plays bass, badly and enthusiastically, in a band of dentists.',
  12,
  array['Porcelain Veneers', 'Smile Design', 'Crowns & Bridges'],
  array['DMD, Boston University', 'Advanced Aesthetic Continuum, Kois Center'],
  array['English', 'French'],
  20
),
(
  'Dr. Priya Raman',
  'dr-priya-raman',
  'BDS, Orthodontics & Clear Aligners',
  'Dr. Raman handles our aligner and orthodontic cases for teenagers and adults. She is precise about planning — every case gets a full digital treatment simulation before the first tray goes in — and honest about what aligners can and cannot fix.

She has treated more than 600 aligner cases and still reviews each set of scans personally.

She is the person on the team most likely to be found explaining a treatment plan to a fourteen-year-old rather than to their parent, on the reasonable grounds that it is their smile.',
  10,
  array['Clear Aligners', 'Invisalign', 'Teen Orthodontics'],
  array['BDS, University of Bristol', 'MSc Orthodontics, King''s College London'],
  array['English', 'Hindi', 'Tamil'],
  30
),
(
  'Anna Whitfield',
  'anna-whitfield',
  'RDH, Lead Dental Hygienist',
  'Anna has been cleaning teeth in Austin for fifteen years and is the reason so many of our patients stop dreading hygiene visits. She is meticulous, gentle, and completely unshockable about how long it has been since your last cleaning.

She runs our periodontal maintenance programme and coaches patients on the small daily habits that prevent the big treatments.

Ask her about interdental brushes at your peril; she is genuinely passionate about them.',
  15,
  array['Preventive Care', 'Periodontal Therapy', 'Nervous Patients'],
  array['RDH, Austin Community College', 'Certified in Local Anaesthesia Administration'],
  array['English'],
  40
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
insert into public.testimonials (patient_name, message, rating, treatment, sort_order)
values
('Marcus T.', 'I had avoided dentists for eleven years out of pure fear. Dr. Marsh talked me through every single step and stopped whenever I raised a hand. Two visits later I am fully caught up and genuinely not scared any more.', 5, 'Teeth Cleaning', 10),
('Rachel P.', 'Cracked a molar on a Sunday evening and they saw me first thing Monday. Out of pain within the hour, permanent crown three weeks later. No drama, no surprise bill.', 5, 'Emergency Care', 20),
('Daniel K.', 'I lost a front tooth in a bike accident. The implant Dr. Marsh placed is indistinguishable from the others — my own mother could not pick which one it was.', 5, 'Dental Implants', 30),
('Sofia R.', 'Dr. Okonjo showed me a digital preview of my veneers and I asked to make them smaller and less white. He agreed immediately. The result looks like my teeth, just better.', 5, 'Porcelain Veneers', 40),
('James H.', 'Fourteen months of aligners and my bottom teeth are finally straight at thirty-eight. Dr. Raman was realistic from day one about what would and would not shift.', 5, 'Clear Aligners', 50),
('Amara O.', 'My six-year-old asks when she can go back to the dentist. I did not think that was a sentence I would ever type.', 5, 'Children''s Dentistry', 60)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
insert into public.faq (question, answer, category, sort_order)
values
('How quickly can I get an appointment?', 'New patient checkups are usually available within the same week, and we hold same-day slots free every weekday for dental emergencies. Submit the appointment form and we will call you back within one business hour to confirm a time.', 'Appointments', 10),
('Do you take my insurance?', 'We are in-network with most major PPO plans and file claims on your behalf. Send us a photo of your card through the contact form and we will verify your coverage and tell you your expected out-of-pocket cost before you book.', 'Payment', 20),
('What does a teeth cleaning cost?', 'A standard hygiene visit starts at $89 and includes a full exam and digital X-rays where needed. If we find that you need deeper periodontal cleaning, we will quote you in writing before starting any additional treatment.', 'Payment', 30),
('I am terrified of the dentist. What can you do?', 'Tell us when you book — it changes how we run your appointment. We schedule extra time, explain each step before it happens, agree a stop signal with you, and can offer numbing gel before any injection as well as sedation options for longer treatments. Roughly a third of our patients describe themselves as anxious.', 'Comfort', 40),
('Are dental implants painful?', 'The placement itself is done under local anaesthetic and is usually comfortable — most patients compare it to having a filling. Expect mild soreness for two to three days afterwards, manageable with over-the-counter pain relief. We call you the evening after surgery to check on you.', 'Treatments', 50),
('How long do dental implants last?', 'With good hygiene and regular checkups, implants routinely last decades and often for life. The crown attached to the implant may need replacing after fifteen to twenty years of normal wear.', 'Treatments', 60),
('Do you offer payment plans?', 'Yes. We offer interest-free monthly plans on treatments over $500 and longer-term financing on larger cases such as implants and full-mouth work. We will lay out the options in writing at your consultation.', 'Payment', 70),
('How often should I have a checkup?', 'Every six months suits most people. If you have gum disease, a history of frequent cavities, or you smoke, we may recommend every three to four months. Your dentist will give you a personal interval rather than a generic one.', 'Appointments', 80),
('At what age should my child first see a dentist?', 'Around their first birthday, or within six months of the first tooth appearing. The early visits are mostly about familiarity rather than treatment — a look, a count, a sticker — so that the dentist never becomes something to fear.', 'Children', 90),
('What should I do in a dental emergency?', 'Call us on (512) 555-0142 straight away. For a knocked-out adult tooth, hold it by the crown, rinse it gently in milk or saline, and try to reseat it in the socket — or keep it in milk — and get to us within the hour. For swelling that affects your breathing or swallowing, go to an emergency room immediately.', 'Emergencies', 100)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
insert into public.blogs
  (title, slug, excerpt, content, author_name, tags, read_minutes,
   is_published, published_at, meta_title, meta_description)
values
(
  'How to Choose a Dentist Near You (Without Guessing)',
  'how-to-choose-a-dentist-near-you',
  'Nine practical checks that separate a dental clinic you will stay with for a decade from one you will leave after two visits.',
  'Searching "dentist near me" gives you a map full of pins and no way to tell them apart. Distance matters, but it is the least useful of the signals available to you. Here is what we would look at if we were choosing a dental clinic for our own family.

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

If you are nervous, say so on the phone and listen to the answer. "Don''t worry, everyone says that" is a bad answer. A description of what they will actually do differently — extra time, a stop signal, numbing gel, sedation options — is a good one.

## 7. Confirm your insurance in advance

Call, or send a photo of your card, and ask for your expected out-of-pocket cost for a checkup. A practice that handles this smoothly before you are a patient will handle it smoothly afterwards.

## 8. Consider the boring logistics

Parking, evening or Saturday hours, how far in advance the next cleaning is available, whether you can reach a human on the phone. These are what determine whether you actually keep going.

## 9. Trust how the first visit felt

You will know. If you were rushed, talked over, or sold to, no amount of technology on the website makes up for it.

## A note on switching

If you already have a dentist and something feels off, you are allowed to leave. Ask for your records and X-rays — they are yours, and any practice will forward them. Nobody needs to have a difficult conversation about it.

If you are in Austin and looking, we are happy to be one of the practices you compare. Book a checkup and see how the first visit feels.',
  'Dr. Elena Marsh',
  array['Choosing a dentist', 'Dental clinic', 'Patient guide'],
  7, true, now() - interval '4 days',
  'How to Choose a Dentist Near You | 9 Practical Checks',
  'Nine practical checks for choosing a dentist near you — from reading the two-star reviews to confirming written quotes and emergency availability.'
),
(
  'How Often Do You Really Need a Teeth Cleaning?',
  'how-often-teeth-cleaning',
  'The six-month rule is a good default and a bad universal law. Here is how to work out the right interval for your mouth.',
  'Almost everyone has heard that you should have a teeth cleaning every six months. It is a sensible default. It is also, for a meaningful minority of people, either too often or nowhere near often enough.

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

If you have no fillings, healthy gums that do not bleed, excellent home hygiene and no risk factors, some dentists will move you to every nine or twelve months. This should be your dentist''s call based on your charts, not a decision you make to save money — the exam that comes with the cleaning is doing a lot of the work.

## What a cleaning actually does that brushing cannot

Brushing and flossing remove soft plaque. Once plaque hardens into tartar — which takes about 24 to 72 hours — no toothbrush will shift it, and its rough surface collects more plaque. Only a professional scale removes it. The hygienist also reaches under the gumline and between teeth where a brush cannot go.

The exam matters as much as the scale. Cavities caught early need a small filling; the same cavity found two years later may need a root canal and a crown. This is the entire economic argument for regular checkups.

## The honest answer

Start at six months. Ask your dentist directly, at your next visit, what interval they recommend for *you* and why. If they cannot point to something in your mouth to justify the answer, ask again.

If it has been years rather than months, book anyway. We have genuinely seen it all, and nobody at this clinic is going to make you feel bad about it.',
  'Anna Whitfield',
  array['Teeth cleaning', 'Preventive care', 'Gum health'],
  6, true, now() - interval '11 days',
  'How Often Do You Need a Teeth Cleaning? | Brightsmile Dental',
  'Is a teeth cleaning every six months right for you? A dental hygienist explains who needs cleanings every three months and who can safely wait longer.'
),
(
  'Dental Implants vs Bridges: An Honest Comparison',
  'dental-implants-vs-bridges',
  'Both replace a missing tooth. They differ in what they cost, what they preserve, and how long they last.',
  'You have lost a tooth, and you have been offered two options: a dental implant or a bridge. Here is the comparison without the sales pitch, including the cases where a bridge is genuinely the better choice.

## What each one actually is

An **implant** replaces the whole tooth, root included. A titanium post is placed in the jawbone, left to fuse with it over several months, then topped with a custom crown.

A **bridge** replaces only the visible part. The teeth on either side of the gap are prepared and crowned, and a false tooth is suspended between them.

## The bone argument for implants

When a tooth root is lost, the jawbone that supported it begins to shrink — noticeably within the first year. An implant is the only option that loads the bone the way a natural root does, which preserves both the bone and the shape of your face over the long term. A bridge sits above the gum and does nothing to prevent that shrinkage.

## The cost of preparing healthy teeth

A conventional bridge requires cutting down two healthy neighbouring teeth. If those teeth are already crowned or heavily filled, that cost is close to zero — you are re-crowning something already treated, and a bridge makes obvious sense. If they are pristine, you are permanently altering two sound teeth to fix a problem with a third.

## Time, cost and longevity

| | Implant | Bridge |
|---|---|---|
| Total treatment time | 3–6 months | 2–3 weeks |
| Typical starting cost | Higher | Lower |
| Neighbouring teeth | Untouched | Prepared and crowned |
| Typical lifespan | Decades, often life | 10–15 years |
| Cleaning | Brush and floss normally | Requires threading under the bridge |

A bridge costs less at the outset, but a bridge replaced twice over thirty years may cost more than one implant placed once.

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

Book an implant consultation and we will tell you honestly which one we would choose in your position.',
  'Dr. Elena Marsh',
  array['Dental implants', 'Bridges', 'Missing teeth'],
  8, true, now() - interval '19 days',
  'Dental Implants vs Bridges: Honest Cost & Longevity Comparison',
  'A dentist compares dental implants and bridges on cost, longevity, bone preservation and healthy-tooth damage — including when a bridge is the better choice.'
),
(
  'Will Cosmetic Dentistry Look Fake? How We Keep It Natural',
  'will-cosmetic-dentistry-look-fake',
  'The fear is reasonable and the cause is specific. Four decisions separate a natural result from an obvious one.',
  'The most common thing patients say in a cosmetic consultation is some version of: I want them better, but I do not want them to look done. That fear is well founded — we have all seen the result you are worried about. It comes from four specific decisions, and all four are avoidable.

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

Book a cosmetic consultation and start with the preview. There is no obligation to go further.',
  'Dr. Samuel Okonjo',
  array['Cosmetic dentistry', 'Veneers', 'Smile design'],
  6, true, now() - interval '27 days',
  'Will Cosmetic Dentistry Look Fake? A Cosmetic Dentist Explains',
  'Worried veneers will look fake? A cosmetic dentist breaks down the four decisions — shade, shape, proportion and overtreatment — that make cosmetic work obvious.'
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Link testimonials to their services where the names line up
-- ---------------------------------------------------------------------------
update public.testimonials t
set service_id = s.id
from public.services s
where t.service_id is null
  and lower(t.treatment) = lower(s.title);
