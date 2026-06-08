'use client';

import type { StayTypeKey } from '@/types';
import type { StayOption } from '@/types/employee-programs';
import { t } from '@/lib/i18n';

interface StayTypeSelectorProps {
  options: StayOption[];
  value: StayTypeKey;
  disabled?: boolean;
  onChange: (value: StayTypeKey) => void;
}

export function StayTypeSelector({ options, value, disabled, onChange }: StayTypeSelectorProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-2">
        {t('programme.list.detailStayTypeLabel')}
      </p>
      <div role="radiogroup" aria-label={t('programme.list.detailStayTypeLabel')} className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <div
              key={opt.key}
              role="radio"
              aria-checked={active}
              tabIndex={disabled ? -1 : 0}
              className="flex items-center cursor-pointer"
              onClick={() => !disabled && onChange(opt.key)}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onChange(opt.key);
                }
              }}
            >
              <span className="w-5 flex-shrink-0 flex items-center">
                {active && <span className="w-2 h-2 rounded-full bg-blue-500" />}
              </span>
              <span className={`text-[13px] flex-1 ${active ? 'font-semibold text-white' : 'font-normal text-white/55'}`}>
                {opt.label}
              </span>
              <span className="text-[13px] text-white/50 ml-10">
                ₹{opt.fee.toLocaleString('en-IN')}/-
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
