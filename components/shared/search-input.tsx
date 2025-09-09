import { Input } from "@/components/ui/input";

interface SearchInputProps {
  q: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ q, onChange, placeholder }: SearchInputProps) => {
  return (
    <Input
      value={q}
      className="md:w-1/2"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
