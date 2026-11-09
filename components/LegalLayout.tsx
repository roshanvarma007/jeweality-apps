import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";
import { JsonLd } from "@/components/JsonLd";
import { Toc } from "@/components/Toc";
import { formatDate, type LegalDoc } from "@/lib/markdown";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Shared layout for Privacy Policy and Terms of Service. */
export function LegalLayout({ doc, path }: { doc: LegalDoc; path: string }) {
  return (
    <div className="container-page pt-10 sm:pt-14" id="top">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: doc.title, path },
        ])}
      />
      <div className="grid gap-x-16 lg:grid-cols-[15rem_minmax(0,var(--container-prose))] lg:justify-center">
        <div className="hidden lg:block" />
        <header className="fade-in max-w-[var(--container-prose)]">
          <nav aria-label="Breadcrumb" className="text-sm text-muted" data-no-print>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                {doc.title}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="rounded-lg ring-1 ring-black/5"
            />
            <p className="text-sm font-bold tracking-[0.12em] text-ink">
              JEWEALITY <span className="font-semibold text-muted">· LEGAL</span>
            </p>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{doc.title}</h1>
          {doc.subtitle && <p className="mt-4 text-lg text-muted sm:text-xl">{doc.subtitle}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 text-[0.95rem] text-muted">
            <p>
              <span className="font-semibold text-ink">Last Updated:</span>{" "}
              <time dateTime={doc.lastUpdated}>{formatDate(doc.lastUpdated)}</time>
            </p>
            <p className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
            <p>Applies to all JEWEALITY apps</p>
          </div>

          {doc.draft && (
            <p
              role="note"
              className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-[0.95rem] text-amber-900"
            >
              <strong>Draft:</strong> this document is pending review by JEWEALITY and may change
              before it is finalised.
            </p>
          )}
        </header>

        <aside className="mt-10 lg:row-start-2 lg:mt-10">
          <Toc items={doc.toc} />
        </aside>

        <article className="max-w-[var(--container-prose)] lg:row-start-2 lg:mt-8">
          <div className="prose-legal" dangerouslySetInnerHTML={{ __html: doc.html }} />
          <div
            className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[0.95rem]"
            data-no-print
          >
            <a href="#top" className="font-semibold text-accent-dark hover:underline">
              ↑ Back to top
            </a>
            <Link href="/contact" className="text-muted hover:text-ink">
              Questions? Contact us →
            </Link>
          </div>
        </article>
      </div>
      <BackToTop />
    </div>
  );
}
