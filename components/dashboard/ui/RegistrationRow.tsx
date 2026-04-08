import { RegistrationRowProps } from '@/types/admin';

// Extended props for registration row with approval actions
interface RegistrationRowWithActionsProps extends RegistrationRowProps {
  avatar?: React.ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
}

// Individual registration row with approve/deny actions
export default function RegistrationRow({
  name,
  email,
  date,
  avatar,
  onApprove,
  onDeny,
}: RegistrationRowWithActionsProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-borderCard last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        {avatar}
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{name}</div>
          <div className="text-textSidebarMuted text-xs mt-0.5">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-textSidebarMuted text-xs">{date}</div>
        <button 
          onClick={onApprove}
          className="bg-accentGreen hover:bg-accentGreenHover text-white text-xs px-4 py-1.5 rounded transition-colors"
        >
          Approve
        </button>
        <button 
          onClick={onDeny}
          className="bg-accentRed hover:bg-accentRedHover text-white text-xs px-4 py-1.5 rounded transition-colors"
        >
          Deny
        </button>
      </div>
    </div>
  );
}
