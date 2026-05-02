'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './button';

type ModalType = 'confirm' | 'success';

interface Props {
  isOpen: boolean;
  type?: ModalType;

  title?: string;
  description: React.ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;
  doneLabel?: string;

  loading?: boolean;

  stats?: {
    label: string;
    variant?: 'green' | 'orange' | 'blue';
  }[];

  onConfirm?: () => void;
  onCancel?: () => void;
  onDone?: () => void;
}

export default function AppModal({
  isOpen,
  type = 'confirm',

  title,
  description,

  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  doneLabel = 'Done',

  loading = false,
  stats = [],

  onConfirm,
  onCancel,
  onDone,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (type === 'success') onDone?.();
    else onCancel?.();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) close();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  const variantColor = (v?: string) => {
    switch (v) {
      case 'green':
        return 'text-green-400';
      case 'orange':
        return 'text-orange-400';
      case 'blue':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1a1b25] border border-white/10 shadow-2xl p-7 animate-in fade-in zoom-in-95">

        {/* ICON */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${ isSuccess
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            }`}
        >
          {isSuccess ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
        </div>

        {/* TITLE */}
        {title && (
          <h2 className="text-lg font-semibold text-white mb-2">
            {title}
          </h2>
        )}

        {/* DESCRIPTION */}
        <p className="text-sm text-white/50 leading-relaxed mb-4">
          {description}
        </p>

        {/* SUCCESS STATS */}
        {isSuccess && stats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 text-sm">
            {stats.map((s, i) => (
              <span key={i} className={`font-medium ${ variantColor(s.variant) }`}>
                {s.label}
                {i !== stats.length - 1 && (
                  <span className="text-white/30 mx-1">·</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">

          {!isSuccess && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}

          {isSuccess ? (
            <Button onClick={onDone}>
              {doneLabel}
            </Button>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}