import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

type AppAlertProps = {
  title?: string;
  description: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning";
  className?: string;
};

export function AppAlert({
  title,
  description,
  variant = "default",
  className,
}: AppAlertProps) {
  // 👉 Icon based on variant
  const Icon =
    variant === "destructive"
      ? AlertCircle
      : variant === "success"
      ? CheckCircle2
      : variant === "warning"
      ? AlertCircle
      : Info;

  return (
    <Alert
      variant={variant === "destructive" ? "destructive" : "default"}
      className={cn(
        variant === "success" && "border-green-500 text-green-600",
        variant === "warning" && "bg-[#1e1511] border-[#3b2313] text-amber-500",
        className
      )}
    >
      <Icon className={cn("size-5 mt-0.5", variant === "warning" && "text-amber-500")} />

      {title && <AlertTitle>{title}</AlertTitle>}

      <AlertDescription className={cn(variant === "warning" && "text-white/70 text-sm")}>{description}</AlertDescription>
    </Alert>
  );
}


