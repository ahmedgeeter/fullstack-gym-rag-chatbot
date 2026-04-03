import Link from "next/link";

export type CategoryNavItem = {
  label: string;
  href: string;
  count?: number;
};

type CategoryNavProps = {
  items: CategoryNavItem[];
};

export const CategoryNav = ({ items }: CategoryNavProps) => (
  <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
    {items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-foreground"
      >
        {item.label}
        {item.count ? <span className="ml-2 text-muted">({item.count})</span> : null}
      </Link>
    ))}
  </div>
);
