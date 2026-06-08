// Reusable dashboard card used to display metrics and counts.

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  icon?: ReactNode;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-muted-foreground",
  icon,
  iconBg = "bg-primary/10",
}: MetricCardProps) {
  return (
    <Card className="bg-bgStatCard border-borderCard">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-textSidebar text-sm">{title}</p>
            <h3 className="text-white text-3xl font-semibold mt-2">
              {value}
            </h3>

            {subtitle && (
              <p className={`text-sm mt-1 ${subtitleColor}`}>
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}