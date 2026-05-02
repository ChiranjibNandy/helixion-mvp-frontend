'use client';

import InputField from "./input";


interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="w-full max-w-sm">
      <InputField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
      />
    </div>
  );
}