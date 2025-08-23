import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ElementType } from "react";

interface SelectFilterProps {
  initialValue?: string;
  onChange: (value: string) => void;
  options: { label: string; value: string; icon?: ElementType }[];
  placeholder?: string;
}

export const SelectFilter = ({
  initialValue,
  onChange,
  options = [],
  placeholder = "Select option",
}: SelectFilterProps) => {
  return (
    <Select defaultValue={initialValue} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem value={opt.value}>
            <span>
              {opt.icon && <opt.icon className="inline-block h-4 w-4" />}
            </span>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
