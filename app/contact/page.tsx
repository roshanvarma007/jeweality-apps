import Link from "next/link";
import { ContactCards } from "@/components/ContactCards";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/Section";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact JEWEALITY by email or visit our Google Play developer profile.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page pt-14 sm:pt-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an app, feedback, support or partnerships: we'd love to hear from you."
      />
      <div className="mt-12">
        <ContactCards />
      </div>
      <p className="mt-10 text-muted">
        Looking for how we handle data? Read our{" "}
        <Link href="/privacy" className="font-medium text-accent-dark underline underline-offset-4">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="font-medium text-accent-dark underline underline-offset-4">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
