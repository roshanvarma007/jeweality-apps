interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  as: Tag = "h2",
  align = "left",
}: SectionHeadingProps) {
  const center = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${center}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag
        id={id}
        className={`mt-2 font-extrabold text-ink ${Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}
      >
        {title}
      </Tag>
      {description && <p className="mt-4 text-lg text-muted">{description}</p>}
    </div>
  );
}
