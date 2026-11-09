import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | JEWEALITY",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center sm:py-36">
      <p className="text-gradient text-7xl font-extrabold sm:text-8xl">404</p>
      <h1 className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Go to Home
        </Link>
        <Link href="/apps" className="btn btn-secondary">
          Browse apps
        </Link>
      </div>
    </div>
  );
}
