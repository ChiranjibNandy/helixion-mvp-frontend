// ─── Types ────────────────────────────────────────────────────────────────────
interface SectionHeadingProps {
  title: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SectionHeading({ title, className = '' }: SectionHeadingProps) {
  return (
    <p className={`text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-2 ${className}`}>
      {title}
    </p>
  );
}