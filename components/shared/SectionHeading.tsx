type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleClassName?: string;
  className?: string;
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  titleClassName,
  className,
}: SectionHeadingProps) => (
  <div className={`space-y-3 ${className ?? ""}`}>
    {eyebrow ? (
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {eyebrow}
      </p>
    ) : null}
    <h2 className={`text-2xl font-semibold text-foreground md:text-3xl ${titleClassName ?? ""}`}>
      {title}
    </h2>
    {description ? <p className="text-sm text-muted md:text-base">{description}</p> : null}
  </div>
);
