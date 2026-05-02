// components/ui/spinner.tsx
import { cn } from "@/lib/utils";

type SpinnerProps = {
   size?: "sm" | "md" | "lg";
   className?: string;
};

export function Spinner({ size = "md", className }: SpinnerProps) {
   const sizeStyles = {
      sm: "w-4 h-4 border-2",
      md: "w-6 h-6 border-2",
      lg: "w-10 h-10 border-4",
   };

   return (
      <div
         className={cn(
            "rounded-full border-white/30 border-t-white animate-spin",
            sizeStyles[size],
            className
         )}
      />
   );
}