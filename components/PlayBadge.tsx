/**
 * "Get it on Google Play" badge, styled after Google's badge guidelines
 * (black background, Play logo, "GET IT ON / Google Play").
 * To use Google's official badge artwork instead, drop it in /public and swap the inner markup.
 */
function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#00D7FE" d="M3.6 1.8 13.5 12 3.6 22.2c-.3-.2-.5-.6-.5-1.1V2.9c0-.5.2-.9.5-1.1z" />
      <path fill="#FFCE00" d="m16.8 15.3-3.3-3.3 3.3-3.3 4 2.3c1.1.6 1.1 1.6 0 2.2z" />
      <path fill="#FF3A44" d="M16.8 15.3 13.5 12 3.6 22.2c.4.4 1 .4 1.7.1z" />
      <path fill="#00F076" d="M16.8 8.7 5.3 1.7c-.7-.4-1.3-.3-1.7.1L13.5 12z" />
    </svg>
  );
}

interface PlayBadgeProps {
  href: string;
  appName?: string;
  comingSoon?: boolean;
  size?: "sm" | "lg";
  className?: string;
}

export function PlayBadge({
  href,
  appName,
  comingSoon,
  size = "lg",
  className = "",
}: PlayBadgeProps) {
  const sizing =
    size === "lg" ? "h-[3.4rem] gap-3 px-4 rounded-xl" : "h-11 gap-2.5 px-3 rounded-[10px]";
  const logo = size === "lg" ? "size-7" : "size-[1.35rem]";
  const top = size === "lg" ? "text-[0.65rem]" : "text-[0.58rem]";
  const bottom = size === "lg" ? "text-[1.3rem]" : "text-[1.05rem]";

  const inner = (
    <>
      <PlayLogo className={`${logo} shrink-0 ${comingSoon ? "opacity-50 grayscale" : ""}`} />
      <span className="flex flex-col items-start leading-none">
        <span className={`${top} font-medium tracking-wide uppercase`}>
          {comingSoon ? "Coming soon to" : "Get it on"}
        </span>
        <span className={`${bottom} mt-0.5 font-semibold tracking-tight`}>Google Play</span>
      </span>
    </>
  );

  if (comingSoon) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={`${appName ?? "This app"} is coming soon to Google Play`}
        className={`relative z-10 inline-flex cursor-not-allowed items-center border border-line bg-surface text-muted ${sizing} ${className}`}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={appName ? `Get ${appName} on Google Play` : "Get it on Google Play"}
      className={`relative z-10 inline-flex items-center border border-[#a6a6a6] bg-black text-white transition-transform hover:-translate-y-0.5 ${sizing} ${className}`}
    >
      {inner}
    </a>
  );
}
