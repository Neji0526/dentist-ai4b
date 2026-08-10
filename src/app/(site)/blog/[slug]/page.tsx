import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/site/BlogCard";
import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getDoctors,
  getPostBySlug,
  getPosts,
  getRelatedPosts,
  getServices,
  getSiteSettings,
} from "@/lib/data";
import { formatDate, truncate } from "@/lib/format";
import { renderMarkdown, stripMarkdown } from "@/lib/markdown";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) return { title: "Article not found", robots: { index: false } };

  return buildMetadata({
    title: post.meta_title ?? post.title,
    description:
      post.meta_description ??
      post.excerpt ??
      truncate(stripMarkdown(post.content), 155),
    path: `/blog/${post.slug}`,
    settings,
    image: post.cover_image_url,
    type: "article",
    publishedTime: post.published_at,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, settings, services, doctors] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
    getServices(),
    getDoctors(),
  ]);

  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const author = doctors.find((doctor) => doctor.name === post.author_name) ?? null;

  return (
    <>
      <JsonLd data={articleSchema(post, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <PageHeader
        eyebrow={post.tags[0] ?? "Dental health"}
        title={post.title}
        description={post.excerpt ?? undefined}
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: truncate(post.title, 42), path: `/blog/${post.slug}` },
        ]}
        scene="hygiene"
        image={post.cover_image_url}
        imageAlt={post.title}
      >
        <div className="flex items-center gap-3">
          <Avatar name={post.author_name ?? "Author"} src={author?.photo_url} size={44} />
          <div>
            {post.author_name ? (
              <p className="font-semibold text-ink-900">By {post.author_name}</p>
            ) : null}
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-ink-500">
              {author?.title ? (
                <>
                  <span>{author.title}</span>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <time dateTime={post.published_at ?? post.created_at}>
                {formatDate(post.published_at ?? post.created_at)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.read_minutes} min read</span>
            </p>
          </div>
        </div>
      </PageHeader>

      <section className="py-14">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_minmax(320px,0.7fr)] lg:gap-14">
            <article>
              {post.cover_image_url ? (
                <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div
                className="prose-clinic"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />

              {post.tags.length > 0 ? (
                <ul className="mt-10 flex flex-wrap gap-2 border-t border-ink-100 pt-6">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-ink-50 px-3 py-1.5 text-sm text-ink-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <LeadForm
                services={services}
                source={`blog:${post.slug}`}
                title="Have a question about this?"
                description="Send us your details and we'll call you back — no obligation, no sales pitch."
              />
            </aside>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-ink-100 bg-ink-50/70 py-16">
          <Container width="wide">
            <h2 className="text-2xl">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard
                  key={item.id}
                  post={item}
                  author={
                    doctors.find((doctor) => doctor.name === item.author_name) ?? null
                  }
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
