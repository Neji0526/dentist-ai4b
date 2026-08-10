import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // The CMS must never appear in search results.
  robots: { index: false, follow: false },
};

/**
 * Shared only by /admin/login and the guarded (dashboard) group. The auth
 * check lives in admin/(dashboard)/layout.tsx — putting it here would wrap the
 * login page in its own redirect loop.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-ink-50">{children}</div>;
}
