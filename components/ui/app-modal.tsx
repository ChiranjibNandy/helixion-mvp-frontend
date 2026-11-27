'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './button';
import { AppAlert } from '../shared/app-alert';

import { cn } from '@/lib/utils';

type ModalType = 'confirm' | 'success';

interface Props {
  isOpen: boolean;
  type?: ModalType;

  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;
  doneLabel?: string;

  loading?: boolean;
  error?: string | null;

  stats?: {
    label: string;
    variant?: 'green' | 'orange' | 'blue';
  }[];

  onConfirm?: () => void;
  onCancel?: () => void;
  onDone?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function AppModal({
  isOpen,
  type = 'confirm',

  title,
  description,
  children,

  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  doneLabel = 'Done',

  loading = false,
  error,
  stats = [],

  onConfirm,
  onCancel,
  onDone,
  onClose,
  className,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (onClose) onClose();
    else if (type === 'success') onDone?.();
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
        return 'text-accentGreen';
      case 'orange':
        return 'text-accentOrange';
      case 'blue':
        return 'text-link';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
    >
      <div className={cn("w-full max-w-md max-h-[94vh] overflow-y-auto rounded-2xl bg-surface border border-borderCard shadow-2xl p-6 animate-in fade-in zoom-in-95", className)}>
        {children ? (
          <>
            <div className="flex items-center justify-between mb-5">
              {title && (
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              <button onClick={close} className="text-textSidebarMuted hover:text-foreground text-xl font-bold">&times;</button>
            </div>
            {children}
          </>
        ) : (
          <>
            {/* ICON */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${ isSuccess
                ? 'bg-accentGreen/10 text-accentGreen border-accentGreen/20'
                : 'bg-accentOrange/10 text-accentOrange border-accentOrange/20'
                }`}
            >
              {isSuccess ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
            </div>

            {/* TITLE */}
            {title && (
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <p className="text-sm text-textSidebar leading-relaxed mb-4">
                {description}
              </p>
            )}

            {/* SUCCESS STATS */}
            {isSuccess && stats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 text-sm">
                {stats.map((s, i) => (
                  <span key={i} className={`font-medium ${ variantColor(s.variant) }`}>
                    {s.label}
                    {i !== stats.length - 1 && (
                      <span className="text-textSidebarMuted mx-1">·</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mb-4">
                <AppAlert
                  variant="destructive"
                  description={error}
                />
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
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  )}
                  {confirmLabel}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}