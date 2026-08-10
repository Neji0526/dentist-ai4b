import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Lets `NEXT_BUILD_DIR=.next-build npm run build` run while a dev server is
  // still using .next — handy on Windows, where the dev server keeps a lock on
  // its own output directory.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    remotePatterns: [
      // Images uploaded through the admin panel live in Supabase Storage.
      ...(supabaseHost
        ? ([{ protocol: "https", hostname: supabaseHost }] as const)
        : []),
      // Allows editors to paste an external image URL in the CMS.
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
