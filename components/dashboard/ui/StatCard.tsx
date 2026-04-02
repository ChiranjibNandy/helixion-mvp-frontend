import { StatCardProps } from '@/types/admin';
import { COLOR_CLASSES } from '@/constants/admin';

/**
 * Reusable stat card component for displaying metrics
 */
export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  subtitleColor = COLOR_CLASSES.TEXT_BLUE 
}: StatCardProps) {
  return (
    <div className={`${COLOR_CLASSES.BG_CARD} rounded-lg p-6 border ${COLOR_CLASSES.BORDER}`}>
      <div className={`${COLOR_CLASSES.TEXT_MUTED} text-sm font-normal mb-2`}>{title}</div>
      <div className="text-white text-3xl font-semibold mb-1">{value}</div>
      <div className={`text-sm ${subtitleColor}`}>{subtitle}</div>
    </div>
  );
}
