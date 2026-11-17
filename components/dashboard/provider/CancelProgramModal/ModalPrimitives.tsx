import { X } from 'lucide-react';

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Close" className="text-gray-400 hover:text-gray-600">
      <X size={18} />
    </button>
  );
}

const ICON_TONE_CLASS = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
} as const;

export function IconBadge({
  tone,
  children,
}: {
  tone: keyof typeof ICON_TONE_CLASS;
  children: React.ReactNode;
}) {
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ICON_TONE_CLASS[tone]}`}>
      {children}
    </div>
  );
}

export function InfoBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">{children}</div>;
}

export function ModalError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}
