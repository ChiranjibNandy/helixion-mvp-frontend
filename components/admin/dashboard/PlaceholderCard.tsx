import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  title: string;
  className?: string;
}

export function PlaceholderCard({ title, className }: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        "bg-bgCard border border-borderDark border-dashed rounded-xl flex flex-col items-center justify-center py-10 opacity-60 hover:opacity-100 transition-opacity cursor-not-allowed",
        className
      )}
    >
      <h3 className="text-sm font-medium text-textPrimary tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-textMuted mt-1">Coming soon</p>
    </div>
  );
}
