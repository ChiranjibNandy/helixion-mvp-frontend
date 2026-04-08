// ─── Types ────────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-7 h-7 text-[10px]',
  lg: 'w-9 h-9 text-xs',
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`
        rounded-full bg-blue-950/70 text-blue-300 font-medium
        flex items-center justify-center flex-shrink-0
        ring-1 ring-blue-500/20
        ${SIZE_MAP[size]} ${className}
      `}
    >
      {initials}
    </div>
  );
}