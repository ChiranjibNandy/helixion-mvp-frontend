import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabKey = 'enrolments' | 'details' | 'documents';

interface TabBarProps {
  tabs: { key: TabKey; label: string }[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onExport: () => void;
  onCancelProgram: () => void;
  showCancelProgram: boolean;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  onExport,
  onCancelProgram,
  showCancelProgram,
}: TabBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={cn(
              'pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === t.key
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pb-2">
        <button
          onClick={onExport}
          className="inline-flex items-center h-8 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download size={13} className="mr-1.5" /> Export
        </button>
        {showCancelProgram && (
          <button
            onClick={onCancelProgram}
            className="inline-flex items-center h-8 px-3 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-500"
          >
            Cancel Program
          </button>
        )}
      </div>
    </div>
  );
}
