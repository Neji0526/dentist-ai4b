import type { Metadata } from "next";

import { BlogCard } from "@/components/site/BlogCard";
import { BlogFilters, type BlogCategory } from "@/components/site/BlogFilters";
import { CtaBand } from "@/components/site/CtaBand";
import { NewsletterBand } from "@/components/site/NewsletterBand";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { getDoctors, getPosts, getSiteSettings } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { stripMarkdown } from "@/lib/markdown";

type Props = {
  searchParams: Promise<{ tag?: string; q?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: "Dental Health Blog",
    description: `Practical dental advice from the dentists at ${settings.clinic_name} — teeth cleaning intervals, implants versus bridges, cosmetic dentistry and how to choose a dentist near you.`,
    path: "/blog",
    settings,
  });
}

const CATEGORIES: BlogCategory[] = [
  { label: "All articles" },
  { label: "Preventive care", tag: "Preventive care", icon: "shield" },
  { label: "Dental implants", tag: "Dental implants", icon: "implant" },
  { label: "Cosmetic dentistry", tag: "Cosmetic dentistry", icon: "sparkle" },
  { label: "Teeth cleaning", tag: "Teeth cleaning", icon: "smile" },
];

export default async function BlogPage({ searchParams }: Props) {
  const { tag, q } = await searchParams;
  const [settings, allPosts, doctors] = await Promise.all([
    getSiteSettings(),
    getPosts(),
    getDoctors(),
  ]);

  const authorFor = (name: string | null) =>
    doctors.find((doctor) => doctor.name === name) ?? null;

  const term = q?.trim().toLowerCase() ?? "";

  const posts = allPosts.filter((post) => {
    const matchesTag = tag
      ? post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
      : true;

    const matchesTerm = term
      ? [post.title, post.excerpt ?? "", stripMarkdown(post.content), ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(term)
      : true;

    return matchesTag && matchesTerm;
  });

  // Only lead with a featured card on the unfiltered view.
  const isFiltered = Boolean(tag || term);
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />

      <PageHeader
        eyebrow="Dental health blog"
        title="Straight answers about your teeth"
        description="Written by our own dentists and hygienists — no filler, no scare tactics, and honest about the cases where the cheaper option is the right one."
        breadcrumbs={[{ name: "Blog", path: "/blog" }]}
        scene="hygiene"
        imageAlt="Toothbrushes and a dental model on a clinic counter"
      />

      <section className="py-12">
        <Container width="wide">
          <BlogFilters categories={CATEGORIES} activeTag={tag} query={q} />

          {posts.length === 0 ? (
            <p className="mt-10 rounded-2xl bg-ink-50 p-10 text-center text-ink-600">
              {isFiltered
                ? "No articles match that filter yet — try another category."
                : "We’re working on our first articles. Check back soon."}
            </p>
          ) : (
            <div className="mt-9 grid gap-6">
              {!isFiltered ? (
                <>
                  <BlogCard
                    post={featured}
                    featured
                    author={authorFor(featured.author_name)}
                  />
                  {rest.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.map((post) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          author={authorFor(post.author_name)}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      author={authorFor(post.author_name)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        phone={settings.phone}
        icon="calendar"
        primaryLabel="Book an assessment"
        title="Reading up because something is bothering you?"
        description="An assessment beats an internet search. Tell us the symptom and we will tell you what is going on."
      />

      <NewsletterBand source="blog" />
    </>
  );
}
