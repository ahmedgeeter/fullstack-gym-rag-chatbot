import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  placeholder?: string;
  compact?: boolean;
};

export const SearchBar = ({ placeholder = "Search equipment", compact }: SearchBarProps) => (
  <form className="flex w-full items-center gap-2" method="get" action="/shop">
    <Input
      aria-label="Search Coremont catalog"
      name="search"
      type="search"
      placeholder={placeholder}
      className={compact ? "h-9" : undefined}
    />
    <Button type="submit" size={compact ? "sm" : "md"} variant="secondary">
      Search
    </Button>
  </form>
);
