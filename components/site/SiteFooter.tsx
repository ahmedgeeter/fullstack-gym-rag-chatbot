import Link from "next/link";

const footerLinks = [
  {
    title: "Shop",
    items: [
      { label: "All equipment", href: "/shop" },
      { label: "Best sellers", href: "/collections/best-sellers" },
      { label: "Compact home gym", href: "/collections/compact-home-gym" },
      { label: "Studio essentials", href: "/collections/studio-essentials" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Coremont", href: "/about" },
      { label: "Materials & Care", href: "/about" },
      { label: "Trade & Studio", href: "/contact" },
    ],
  },
];

export const SiteFooter = () => (
  <footer className="border-t border-border bg-surface">
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Coremont</p>
          <p className="text-sm text-muted">
            Premium European fitness equipment for home and studio training.
          </p>
          <div className="text-sm text-muted">
            <p>Support: support@coremont.eu</p>
            <p>Phone: +49 30 220 399</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {group.title}
              </p>
              <ul className="space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}-${item.href}`}>
                    <Link href={item.href} className="text-muted hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
        <p>© 2026 Coremont. All rights reserved.</p>
        <p>Designed for European training spaces.</p>
      </div>
    </div>
  </footer>
);
