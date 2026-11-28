import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type TabKey = 'enrolments' | 'details' | 'documents';

interface TabBarProps {
  tabs: { key: TabKey; label: string }[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onExport: () => void;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  onExport,
}: TabBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-borderCard">
      <div className="flex items-center gap-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              'pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === t.key
                ? 'text-primary border-primary'
                : 'text-textSidebarMuted border-transparent hover:text-textSecondary'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
        >
          <Download size={13} className="mr-1.5" /> Export
        </Button>
      </div>
    </div>
  );
}
