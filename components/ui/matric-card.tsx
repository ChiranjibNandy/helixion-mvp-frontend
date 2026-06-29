import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  badge?: string;
  icon?: ReactNode;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-muted-foreground",
  badge,
  icon,
  iconBg = "bg-primary/10",
}: MetricCardProps) {
  return (
    <Card className="bg-bgStatCard border-borderCard py-0 gap-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-textSidebar text-xs">{title}</p>
            <h3 className="text-white text-2xl font-semibold mt-1.5">
              {value}
            </h3>

            {subtitle && (
              <p className={`text-xs mt-1 ${subtitleColor}`}>
                {subtitle}
              </p>
            )}

            {badge && (
              <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                {badge}
              </span>
            )}
          </div>

          {icon && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-3 ${iconBg}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
