import Image from "next/image";
import Link from "next/link";

/** JEWEALITY mark + wordmark, links home. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-lg"
      aria-label="JEWEALITY – Home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        className="rounded-[10px] shadow-sm ring-1 ring-black/5"
      />
      <span className="text-[1.05rem] font-extrabold tracking-[0.08em] text-ink">JEWEALITY</span>
    </Link>
  );
}
