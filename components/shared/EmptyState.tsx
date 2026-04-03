type EmptyStateProps = {
  title: string;
  description?: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-8 text-center">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    {description ? <p className="text-sm text-muted">{description}</p> : null}
  </div>
);
