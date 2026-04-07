import { StatCardProps } from '@/types/admin';

/**
 * Reusable stat card component for displaying metrics
 */
export default function StatCard({
  title,
  value,
  subtitle,
  subtitleColor = 'text-blue-400'
}: StatCardProps) {
  return (
    <div className="bg-bgStatCard rounded-lg p-6 border border-borderCard">
      <div className="text-textSidebar text-sm font-normal mb-2">{title}</div>
      <div className="text-white text-3xl font-semibold mb-1">{value}</div>
      <div className={`text-sm ${subtitleColor}`}>{subtitle}</div>
    </div>
  );
}
