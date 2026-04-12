import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border-border text-foreground",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },

      // ✅ ADD THIS
      status: {
        pending:
          "bg-amber-950/60 text-amber-400 ring-1 ring-amber-500/20",
        active:
          "bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-500/20",
        completed:
          "bg-blue-950/60 text-blue-300 ring-1 ring-blue-500/20",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Badge({
  className,
  variant = "default",
  status,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    status?: "pending" | "active" | "completed";
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, status }), className)}
      {...props}
    />
  );
}