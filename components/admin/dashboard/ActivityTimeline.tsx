import { cn } from "@/lib/utils";

const MOCK_ACTIVITY = [
  { id: 1, text: "Priya Singh approved — role: Employee", time: "2 min ago", type: "success" },
  { id: 2, text: "Kiran Iyer denied — duplicate account", time: "18 min ago", type: "danger" },
  { id: 3, text: "Sunita Rao deactivated by admin", time: "1 hr ago", type: "danger" },
  { id: 4, text: "Bulk import completed — 14 users added", time: "3 hrs ago", type: "neutral" },
  { id: 5, text: "Vikram Nair role changed — Manager", time: "Yesterday", type: "neutral" },
  { id: 6, text: "New org registered: LearnPro Pvt Ltd", time: "Yesterday", type: "neutral" },
];

export function ActivityTimeline() {
  return (
    <div className="bg-bgCard border border-borderDark rounded-xl p-6 flex flex-col h-full">
      <h3 className="text-sm font-medium text-textPrimary tracking-tight mb-6">
        Recent activity
      </h3>

      <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
        {MOCK_ACTIVITY.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div
              className={cn(
                "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm relative z-10",
                activity.type === 'success' && "bg-statusActive",
                activity.type === 'danger' && "bg-statusInactive",
                activity.type === 'neutral' && "bg-textMuted"
              )}
            />
            <div className="flex flex-col">
              <span className="text-sm text-textPrimary tracking-tight leading-snug">
                {activity.text}
              </span>
              <span className="text-xs text-textMuted mt-0.5">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
