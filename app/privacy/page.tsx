import { LegalLayout } from "@/components/LegalLayout";
import { loadLegalDoc } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const doc = await loadLegalDoc("privacy");
  return pageMetadata({ title: doc.title, description: doc.description, path: "/privacy" });
}

export default async function PrivacyPage() {
  const doc = await loadLegalDoc("privacy");
  return <LegalLayout doc={doc} path="/privacy" />;
}
