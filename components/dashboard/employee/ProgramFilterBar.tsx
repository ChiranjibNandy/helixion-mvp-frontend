'use client';

import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import SearchInput from '@/components/ui/search-input';
import { DateInput } from '@/components/shared/date-input';
import type { Filters } from '@/types/employee-programs';
import { t } from '@/lib/i18n';

const HEADER_CLASS = 'text-[10px] font-semibold tracking-widest uppercase text-white/30';

interface Props {
  draft: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
  onClear: () => void;
  loading?: boolean;
}

export function ProgramFilterBar({ draft, onChange, onApply, onClear, loading }: Props) {
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
          <SearchInput
            value={draft.title}
            onChange={(v) => set('title', v)}
            placeholder={t('programme.list.filterTitlePlaceholder')}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex-1 min-w-[160px]">
          <p className={`${HEADER_CLASS} mb-1.5`}>{t('programme.list.filterVenueLabel')}</p>
          <SearchInput
            value={draft.venue}
            onChange={(v) => set('venue', v)}
            placeholder={t('programme.list.filterVenuePlaceholder')}
            onKeyDown={handleKeyDown}
            icon={<MapPin className="w-3.5 h-3.5" />}
          />
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
            disabled={loading}
            className="border-[#1e2d40] text-white/50 hover:text-white bg-transparent text-[12px] h-9 px-4"
          >
            {t('programme.list.clearFilters')}
          </Button>
          <Button
            onClick={onApply}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-9 px-5 font-medium disabled:opacity-70 min-w-[72px] flex items-center justify-center gap-1.5"
          >
            {loading ? <Spinner size="sm" /> : t('programme.list.applyFilters')}
          </Button>
        </div>

      </div>
    </div>
  );
}
