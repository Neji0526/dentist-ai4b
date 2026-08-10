import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-display-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title =
    settings.default_meta_title ??
    `${settings.clinic_name} | Dentist in ${settings.city ?? "your area"}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings.clinic_name}`,
    },
    description:
      settings.default_meta_description ??
      settings.tagline ??
      "Gentle, modern dentistry for the whole family.",
    applicationName: settings.clinic_name,
    authors: [{ name: settings.clinic_name }],
    formatDetection: { telephone: true, address: true },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1466cd",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
