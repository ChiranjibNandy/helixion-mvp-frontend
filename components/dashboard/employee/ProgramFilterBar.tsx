'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar } from 'lucide-react';
import type { Filters } from '@/types/employee-programs';
import { toDisplayDate } from '@/utils/formatters';
import { t } from '@/lib/i18n';

const HEADER_CLASS = 'text-[10px] font-semibold tracking-widest uppercase text-white/30';

function DateInput({ value, placeholder, onChange }: {
  value: string; placeholder: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex-1 min-w-[155px]">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
      <input
        type={focused ? 'date' : 'text'}
        placeholder={placeholder}
        value={focused ? value : toDisplayDate(value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-2 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white/70 placeholder:text-white/30 text-[12px] outline-none focus:border-blue-500 [color-scheme:dark]"
      />
    </div>
  );
}

interface Props {
  draft: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
  onClear: () => void;
}

export function ProgramFilterBar({ draft, onChange, onApply, onClear }: Props) {
  function set(key: keyof Filters, value: string) {
    onChange({ ...draft, [key]: value });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onApply();
  }

  return (
    <div className="rounded-lg border border-[#1e2d40] bg-[#0d1526] px-5 py-4">
      <div className="flex items-end gap-4 flex-wrap">

        <div className="flex-1 min-w-[160px]">
          <p className={`${HEADER_CLASS} mb-1.5`}>{t('programme.list.filterTitleLabel')}</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
            <input
              placeholder={t('programme.list.filterTitlePlaceholder')}
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/20 text-[12px] outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[160px]">
          <p className={`${HEADER_CLASS} mb-1.5`}>{t('programme.list.filterVenueLabel')}</p>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none z-10" />
            <input
              placeholder={t('programme.list.filterVenuePlaceholder')}
              value={draft.venue}
              onChange={(e) => set('venue', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 h-9 rounded-md border border-[#1e2d40] bg-[#111827] text-white placeholder:text-white/20 text-[12px] outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[360px]">
          <p className={`${HEADER_CLASS} mb-1.5`}>{t('programme.list.filterDateRange')}</p>
          <div className="flex items-center gap-2">
            <DateInput
              value={draft.fromDate}
              placeholder={t('programme.list.filterDateFrom')}
              onChange={(v) => set('fromDate', v)}
            />
            <span className="text-white/25 text-[12px] flex-shrink-0">—</span>
            <DateInput
              value={draft.toDate}
              placeholder={t('programme.list.filterDateTo')}
              onChange={(v) => set('toDate', v)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClear}
            className="border-[#1e2d40] text-white/50 hover:text-white bg-transparent text-[12px] h-9 px-4"
          >
            {t('programme.list.clearFilters')}
          </Button>
          <Button
            onClick={onApply}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-9 px-5 font-medium"
          >
            {t('programme.list.applyFilters')}
          </Button>
        </div>

      </div>
    </div>
  );
}
