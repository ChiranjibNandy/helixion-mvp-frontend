import { Download, LockKeyhole } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

export type TabKey = 'enrolments' | 'details' | 'documents';

interface TabBarProps {
  tabs: { key: TabKey; label: string }[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onExport: () => void;
  onCancelProgram: () => void;
  onCloseFreezeEnrollments: () => void;
  showCancelProgram: boolean;
  isFrozen: boolean;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  onExport,
  onCancelProgram,
  onCloseFreezeEnrollments,
  showCancelProgram,
  isFrozen,
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
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <Download size={13} className="mr-1.5" /> {t("providerDashboard.quickActions.exportEnrolment.link")}
        </Button>
        {showCancelProgram && (
          <Button
            size="sm"
            disabled={isFrozen}
            onClick={onCancelProgram}
            className={cn("text-white",
              isFrozen
                ? "bg-red-600 cursor-not-allowed opacity-20"
                : "bg-red-600 hover:bg-red-500"
            )}
          >
            {t("programme.cancelProgram")}
          </Button>
        )}
        <Button
          size="sm"
          disabled={isFrozen}
          onClick={onCloseFreezeEnrollments}
          className={cn(
            "text-white",
            isFrozen
              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          <LockKeyhole size={14} className="mr-1.5" />
          {isFrozen
            ? "Enrolments Frozen"
            : t("programme.enrollments.closeFreezeEnrollment")}
        </Button>
      </div>
    </div >
  );
}
