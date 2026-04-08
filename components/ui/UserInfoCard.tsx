"use client";

// Props for the UserInfoCard component
interface UserInfoCardProps {
  name: string;
  email: string;
  className?: string;
}

// Card component for displaying user information
export default function UserInfoCard({
  name,
  email,
  className = "",
}: UserInfoCardProps) {
  return (
    <div
      className={`bg-bgMain rounded-lg p-4 border border-borderCard ${className}`}
    >
      <div className="text-white text-sm font-medium">{name}</div>
      <div className="text-textSidebarMuted text-xs mt-1">{email}</div>
    </div>
  );
}
