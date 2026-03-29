import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, subtitle, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-bgCard border border-borderDark flex flex-col justify-between overflow-hidden relative",
        className
      )}
    >
      <h3 className="text-sm font-medium text-textMuted tracking-tight">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-3xl font-semibold text-textPrimary tracking-tight">
          {value}
        </p>
        {subtitle && (
          <div className="text-sm text-textMuted font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
