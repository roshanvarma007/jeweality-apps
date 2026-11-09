import { LegalLayout } from "@/components/LegalLayout";
import { loadLegalDoc } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const doc = await loadLegalDoc("terms");
  return pageMetadata({ title: doc.title, description: doc.description, path: "/terms" });
}

export default async function TermsPage() {
  const doc = await loadLegalDoc("terms");
  return <LegalLayout doc={doc} path="/terms" />;
}
