import { useEffect, useRef } from 'react';

export default function ModalShell({
  isOpen,
  onOverlayClose,
  children,
}: {
  isOpen: boolean;
  onOverlayClose: () => void;
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOverlayClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onOverlayClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md max-h-[94vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95"
      >
        {children}
      </div>
    </div>
  );
}
