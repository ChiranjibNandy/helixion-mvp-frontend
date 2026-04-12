import * as React from "react"

import { cn } from "@/lib/utils"
import { Label as LabelPrimitive } from "radix-ui"
import { Eye, EyeOff } from "lucide-react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}



type InputFieldProps = {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  showToggle?: boolean;
} & React.ComponentProps<"input">;

export default function InputField({
  label,
  icon,
  error,
  showToggle = false,
  type = "text",
  className,
  ...props
}: InputFieldProps) {
  const [visible, setVisible] = React.useState(false);

  const inputType = showToggle
    ? visible
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex flex-col gap-1.5">
      {/* ✅ Label */}
      {label && (
        <Label className="text-xs font-semibold tracking-widest uppercase text-textMuted">
          {label}
        </Label>
      )}

      {/* ✅ Input Wrapper */}
      <div className="relative flex items-center">
        {/* Icon */}
        {icon && (
          <span className="absolute left-3.5 text-muted-foreground">
            {icon}
          </span>
        )}

        {/* Input */}
        <Input
          type={inputType}
          className={cn(
            "py-3 text-sm",
            icon ? "pl-10" : "pl-3",
            showToggle ? "pr-10" : "pr-3",
            error &&
              "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />

        {/* Password Toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 text-muted-foreground"
            tabIndex={-1}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

