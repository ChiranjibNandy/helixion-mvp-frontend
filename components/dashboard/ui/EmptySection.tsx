import { EmptySectionProps } from '@/types/admin';
import { COLOR_CLASSES } from '@/constants/admin';

/**
 * Placeholder section component for future features
 */
export default function EmptySection({ title, subtitle }: EmptySectionProps) {
  return (
    <div className={`${COLOR_CLASSES.BG_CARD} rounded-lg border ${COLOR_CLASSES.BORDER} p-6 flex flex-col items-center justify-center h-full min-h-[200px]`}>
      <h3 className="text-white text-base font-semibold mb-2">{title}</h3>
      <p className={`${COLOR_CLASSES.TEXT_MUTED} text-sm`}>{subtitle}</p>
    </div>
  );
}
