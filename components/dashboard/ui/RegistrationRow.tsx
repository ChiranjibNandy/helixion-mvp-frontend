import { RegistrationRowProps } from '@/types/admin';

/**
 * Individual registration row with approve/deny actions
 */
export default function RegistrationRow({
  name,
  email,
  date,
  icon,
  iconBg
}: RegistrationRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-borderCard last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{name}</div>
          <div className="text-textSidebarMuted text-xs mt-0.5">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-textSidebarMuted text-xs">{date}</div>
        <button className="bg-accentGreen hover:bg-accentGreenHover text-white text-xs px-4 py-1.5 rounded transition-colors">
          Approve
        </button>
        <button className="bg-accentRed hover:bg-accentRedHover text-white text-xs px-4 py-1.5 rounded transition-colors">
          Deny
        </button>
      </div>
    </div>
  );
}
