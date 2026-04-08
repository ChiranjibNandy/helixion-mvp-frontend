"use client";

import { CheckCircle } from "lucide-react";

// Props for the SuccessState component
interface SuccessStateProps {
  message: string;
  iconSize?: number;
  containerSize?: "sm" | "md" | "lg";
  className?: string;
}

// Size configurations
const containerSizes = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
} as const;

const iconSizes = {
  sm: 20,
  md: 32,
  lg: 40,
} as const;

// Success state component with icon and message
export default function SuccessState({
  message,
  iconSize,
  containerSize = "md",
  className = "",
}: SuccessStateProps) {
  const containerClass = containerSizes[containerSize];
  const iconDimension = iconSize || iconSizes[containerSize];

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 space-y-4 ${className}`}
    >
      <div
        className={`${containerClass} rounded-full bg-accentGreen/20 flex items-center justify-center`}
      >
        <CheckCircle size={iconDimension} className="text-accentGreen" />
      </div>
      <p className="text-white text-sm font-medium">{message}</p>
    </div>
  );
}
