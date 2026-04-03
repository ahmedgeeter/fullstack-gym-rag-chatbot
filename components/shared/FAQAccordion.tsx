import type { FAQ } from "@/types/catalog";

export const FAQAccordion = ({ items }: { items: FAQ[] }) => (
  <div className="space-y-4">
    {items.map((faq) => (
      <details
        key={faq.id}
        className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
      >
        <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
          {faq.question}
        </summary>
        <p className="mt-3 text-sm text-muted">{faq.answer}</p>
      </details>
    ))}
  </div>
);
