import { updateSettingsAction } from "@/app/admin/actions";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { adminSessionOrNull } from "@/lib/admin/auth";
import type { SiteSettings } from "@/lib/types";
import { demoSettings } from "@/lib/demo-data";


export default async function AdminSettingsPage() {
  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase } = session;

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  // First run: no settings row yet, so seed the form from the demo defaults.
  const settings = (data as SiteSettings | null) ?? {
    ...demoSettings,
    phone: null,
    email: null,
    address_line: null,
  };

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl">Clinic details & SEO</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          These values drive the header, footer, contact page, structured data
          for Google, and the default page titles across the whole site.
        </p>
      </header>

      <SettingsForm settings={settings} action={updateSettingsAction} />
    </div>
  );
}
