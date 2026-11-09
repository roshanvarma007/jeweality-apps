import { Suspense } from "react";
import { AppGrid } from "@/components/AppCard";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/Section";
import { SearchFilter } from "@/components/SearchFilter";
import { categories, publicApps } from "@/lib/apps";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apps",
  description:
    "Browse every JEWEALITY app: productivity tools, utilities, games and AI-powered apps on Google Play.",
  path: "/apps",
});

export default function AppsPage() {
  return (
    <div className="container-page pt-14 pb-8 sm:pt-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Apps", path: "/apps" },
        ])}
      />
      <SectionHeading
        as="h1"
        eyebrow="Catalogue"
        title="All JEWEALITY apps"
        description="Search and filter every app we publish on Google Play."
      />
      <div className="mt-10">
        {/* Without JS (or before hydration) the full list is shown, which also keeps it crawlable. */}
        <Suspense fallback={<AppGrid apps={publicApps} headingLevel="h2" />}>
          <SearchFilter apps={publicApps} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
