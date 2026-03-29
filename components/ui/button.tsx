import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "outline-success" | "outline-danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue focus-visible:ring-offset-2 focus-visible:ring-offset-bgMain disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-accentBlue text-white hover:bg-blue-600 shadow-sm",
      outline: "border border-borderLight bg-transparent hover:bg-bgHover text-textPrimary",
      ghost: "hover:bg-bgHover text-textSecondary hover:text-textPrimary",
      destructive: "bg-statusInactive text-white hover:bg-red-600 shadow-sm",
      "outline-success": "border border-statusActive/30 text-statusActive hover:bg-statusActiveBg",
      "outline-danger": "border border-statusInactive/30 text-statusInactive hover:bg-statusInactiveBg",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
