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

export function StayTypeSelector({
  options,
  value,
  disabled,
  onChange,
}: StayTypeSelectorProps) {
  return (
    <div className="w-full max-w-[380px]">
      {/* HEADERS */}
      <div className="grid grid-cols-[minmax(160px,1fr)_110px] items-center mb-2">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30">
          {t('programme.list.detailStayTypeLabel')}
        </p>

        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 text-right">
          {t('programme.list.detailStayPriceLabel')}
        </p>
      </div>

      {/* OPTIONS */}
      <div
        role="radiogroup"
        aria-label={t('programme.list.detailStayTypeLabel')}
        className="flex flex-col gap-1.5 ml-[-20px]"
      >
        {options.map((opt) => {
          const active = value === opt.key;

          return (
            <div
              key={opt.key}
              role="radio"
              aria-checked={active}
              tabIndex={disabled ? -1 : 0}
              className="grid grid-cols-[minmax(160px,1fr)_110px] items-center cursor-pointer rounded-sm"
              onClick={() => !disabled && onChange(opt.key)}
              onKeyDown={(e) => {
                if (
                  !disabled &&
                  (e.key === 'Enter' || e.key === ' ')
                ) {
                  e.preventDefault();
                  onChange(opt.key);
                }
              }}
            >
              {/* STAY TYPE */}
              <div className="flex items-center min-w-0">
                <span className="w-5 flex-shrink-0 flex items-center">
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </span>

                <span
                  className={`text-[13px] ${active
                    ? 'font-semibold text-white'
                    : 'font-normal text-white/55'
                    }`}
                >
                  {opt.label}
                </span>
              </div>

              {/* PRICE */}
              <span
                className={`text-[13px] text-right ${active
                  ? 'font-medium text-white/80'
                  : 'text-white/50'
                  }`}
              >
                ₹{opt.fee.toLocaleString('en-IN')}/-
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}