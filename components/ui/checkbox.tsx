import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-[4px] border border-borderLight bg-bgCard ring-offset-bgMain focus-visible:outline-none focus:ring-2 focus:ring-accentBlue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-accentBlue checked:border-accentBlue relative after:content-[''] after:absolute after:hidden checked:after:block after:top-[1px] after:left-[4px] after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45 transition-colors cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
