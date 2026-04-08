"use client";

import { AVATAR_BACKGROUNDS } from "@/constants/admin";

// Props for the Avatar component
interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
  className?: string;
}

// Size configurations
const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
} as const;

// Get initials from name (max 2 characters)
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Avatar component with improved visibility
export default function Avatar({
  name,
  size = "md",
  bgColor,
  className = "",
}: AvatarProps) {
  const initials = getInitials(name);
  const sizeClass = sizeClasses[size];

  // If no bgColor provided, generate one based on name
  const backgroundClass =
    bgColor ||
    AVATAR_BACKGROUNDS[
      name.length % AVATAR_BACKGROUNDS.length
    ];

  return (
    <div
      className={`
        ${sizeClass}
        ${backgroundClass}
        rounded-lg
        flex
        items-center
        justify-center
        font-bold
        text-white
        shadow-sm
        ring-2
        ring-white/20
        ${className}
      `}
      aria-label={`Avatar for ${name}`}
      title={name}
    >
      {initials}
    </div>
  );
}

// Reusable avatar for registration rows with consistent styling
interface RegistrationAvatarProps {
  name: string;
  index?: number;
}

// Pre-configured avatar for registration list
export function RegistrationAvatar({
  name,
  index = 0,
}: RegistrationAvatarProps) {
  const bgColor = AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length];

  return <Avatar name={name} size="md" bgColor={bgColor} />;
}
