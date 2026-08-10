import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { StickyMobileCta } from "@/components/site/StickyMobileCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { getServices, getSiteSettings } from "@/lib/data";
import { dentistSchema } from "@/lib/seo";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <>
      <JsonLd data={dentistSchema(settings, services)} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar
        clinicName={settings.clinic_name}
        phone={settings.phone}
        city={settings.city}
      />

      {/* Bottom padding leaves room for the sticky mobile CTA bar. */}
      <main id="main" className="pb-24 lg:pb-0">
        {children}
      </main>

      <Footer settings={settings} services={services} />
      <StickyMobileCta phone={settings.phone} />
    </>
  );
}
