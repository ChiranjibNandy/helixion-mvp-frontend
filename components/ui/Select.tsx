"use client";

import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  className?: string;
  containerClassName?: string;
}

/**
 * A reusable, premium-styled select component
 */
export default function Select({
  options,
  className = "",
  containerClassName = "",
  disabled,
  ...props
}: SelectProps) {
  // Memoize options to prevent unnecessary re-renders of the dropdown list
  const renderedOptions = useMemo(() => {
    return options.map((option) => (
      <option 
        key={option.value} 
        value={option.value}
        className="bg-bgStatCard text-white"
      >
        {option.label}
      </option>
    ));
  }, [options]);

  return (
    <div className={`relative ${containerClassName}`}>
      <select
        disabled={disabled}
        className={`
          w-full
          appearance-none
          bg-bgStatCard
          border
          border-borderCard
          rounded-lg
          px-4
          py-3
          pr-10
          text-white
          text-sm
          focus:outline-none
          focus:border-primary
          focus:ring-1
          focus:ring-primary
          transition-colors
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {renderedOptions}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown
          size={16}
          className={`text-textSidebarMuted ${disabled ? "opacity-50" : ""}`}
        />
      </div>
    </div>
  );
}
