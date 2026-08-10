import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata, fullAddress } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: "Privacy Policy",
    description: `How ${settings.clinic_name} collects, uses and protects the information you send through this website.`,
    path: "/privacy",
    settings,
  });
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const address = fullAddress(settings);

  return (
    <>
      <PageHeader
        title="Privacy policy"
        description="What happens to the information you send us through this website."
        breadcrumbs={[{ name: "Privacy", path: "/privacy" }]}
      />

      <section className="py-14">
        <Container width="narrow">
          <div className="prose-clinic">
            <p>
              This policy is a starting template for {settings.clinic_name}. Have
              it reviewed against HIPAA and your state’s requirements before you
              go live — your practice’s obligations depend on how you store and
              share patient information.
            </p>

            <h2>What we collect</h2>
            <p>
              When you submit the appointment or contact form we collect your
              name, phone number, and optionally your email address, the
              treatment you are interested in, your preferred appointment time
              and any message you write. We also record which page the form was
              submitted from so we can see which parts of the site are useful.
            </p>
            <p>
              Please do not send detailed medical history through this website.
              We will take that from you securely at your appointment.
            </p>

            <h2>How we use it</h2>
            <p>
              We use your details for one purpose: to contact you about your
              enquiry and arrange your appointment. We do not add you to a
              marketing list, and we do not sell or share your information with
              third parties for advertising.
            </p>

            <h2>Where it is stored</h2>
            <p>
              Form submissions are stored in our practice management database,
              hosted by Supabase. Access is restricted to authorised clinic staff
              who are signed in to our admin system. Transmission is encrypted in
              transit.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not become appointments are deleted once they are
              no longer useful for follow-up. If you become a patient, your
              records are kept for as long as required by state dental record
              retention rules.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us at any time what information we hold about you, ask
              us to correct it, or ask us to delete an enquiry. Contact us using
              the details below and we will action it.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              This site sets no advertising or tracking cookies of its own. If you
              add an analytics tool, disclose it here along with how visitors can
              opt out.
            </p>

            <h2>Contact us</h2>
            <p>
              {settings.clinic_name}
              {address ? <>, {address}</> : null}
              {settings.phone ? (
                <>
                  <br />
                  Phone: <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                </>
              ) : null}
              {settings.email ? (
                <>
                  <br />
                  Email: <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </>
              ) : null}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
