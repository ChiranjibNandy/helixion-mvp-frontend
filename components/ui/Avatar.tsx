"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

// ─── Shadcn Base Components ───────────────────────────
function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  );
}

// ─── Your Custom Wrapper (Reusable) ───────────────────
interface AppAvatarProps {
  initials: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function AppAvatar({
  initials,
  src,
  size = "md",
  className = "",
}: AppAvatarProps) {
  const sizeValue =
    size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  return (
    <Avatar size={sizeValue} className={cn(className)}>
      {src && <AvatarImage src={src} alt={initials} />}

      <AvatarFallback
        className="
          bg-blue-950/70 text-blue-300 font-medium
          ring-1 ring-blue-500/20
        "
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// ─── Export ───────────────────────────────────────────
export {
  AppAvatar,         
};