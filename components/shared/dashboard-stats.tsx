import { MetricCard } from "@/components/ui/matric-card";

export interface DashboardStat {
   title: string;
   value: string | number;
   subtitle?: string;
   subtitleColor?: string;
   badge?: string;
   icon?: React.ReactNode;
   iconBg?: string;
}

interface DashboardStatsProps {
   stats: DashboardStat[];
   columns?: string;
}

export function DashboardStats({
   stats,
   columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}: DashboardStatsProps) {
   return (
      <div className={`grid ${columns} gap-4`}>
         {stats.map((stat) => (
            <MetricCard key={stat.title} {...stat} />
         ))}
      </div>
   );
}
