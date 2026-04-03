import { Input } from "@/components/ui/input";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  title: string;
  name: string;
  options: FilterOption[];
  type?: "radio" | "checkbox";
};

type ProductFiltersProps = {
  groups: FilterGroup[];
  selected?: Record<string, string | string[] | undefined>;
  minPrice?: string;
  maxPrice?: string;
};

const isChecked = (
  selected: ProductFiltersProps["selected"],
  name: string,
  value: string,
  type: "radio" | "checkbox"
) => {
  if (!selected) return false;
  const current = selected[name];
  if (type === "checkbox") {
    return Array.isArray(current) ? current.includes(value) : current === value;
  }
  return current === value;
};

export const ProductFilters = ({
  groups,
  selected,
  minPrice,
  maxPrice,
}: ProductFiltersProps) => (
  <aside className="space-y-6 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Price</p>
      <div className="mt-3 flex items-center gap-2">
        <Input name="minPrice" placeholder="Min" className="h-9" defaultValue={minPrice} />
        <Input name="maxPrice" placeholder="Max" className="h-9" defaultValue={maxPrice} />
      </div>
    </div>
    {groups.map((group) => {
      const inputType = group.type ?? "radio";
      return (
        <div key={group.title}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {group.title}
          </p>
          <div className="mt-3 space-y-2 text-sm">
            {group.options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type={inputType}
                  name={group.name}
                  value={option.value}
                  defaultChecked={isChecked(selected, group.name, option.value, inputType)}
                  className="h-4 w-4 rounded border-border"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    })}
  </aside>
);
