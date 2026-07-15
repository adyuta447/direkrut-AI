"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupAddon>
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
