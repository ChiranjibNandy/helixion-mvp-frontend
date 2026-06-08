'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { AvailableProgram, StayTypeKey } from '@/types';
import type { StayOption, DetailPanelProps } from '@/types/employee-programs';
import { t } from '@/lib/i18n';
import { AppAlert } from '@/components/shared/app-alert';

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

function buildStayOptions(program: AvailableProgram): StayOption[] {
  return ([
    { key: 'single_occupancy' as StayTypeKey, label: t('programme.list.stayTypeSingle'),         fee: program.singleOccupancyFee },
    { key: 'twin_sharing'     as StayTypeKey, label: t('programme.list.stayTypeTwin'),            fee: program.twinSharingFee },
    { key: 'non_residential'  as StayTypeKey, label: t('programme.list.stayTypeNonResidential'), fee: program.nonResidentialFee },
  ] as { key: StayTypeKey; label: string; fee: number | undefined }[])
    .filter((o): o is StayOption => o.fee !== undefined && o.fee !== null);
}

export function ProgramDetailPanel({ program, onEnrol, enrolling, enrolled, error }: DetailPanelProps) {
  const stayOptions = buildStayOptions(program);
  const defaultKey  = stayOptions.find((o) => o.key === 'twin_sharing')?.key ?? stayOptions[0]?.key ?? 'twin_sharing';
  const [selectedStay, setSelectedStay] = useState<StayTypeKey>(defaultKey as StayTypeKey);

  return (
    <div className="bg-[#0d1527] px-6 py-5">
      <div className="flex justify-between gap-12">

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1">
              {t('programme.list.detailVenueLabel')}
            </p>
            <p className="text-[13px] text-white">{program.venue}</p>
          </div>

          {stayOptions.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-2">
                {t('programme.list.detailStayTypeLabel')}
              </p>
              <div role="radiogroup" aria-label={t('programme.list.detailStayTypeLabel')} className="flex flex-col gap-1.5">
                {stayOptions.map((opt) => {
                  const active = selectedStay === opt.key;
                  return (
                    <div
                      key={opt.key}
                      role="radio"
                      aria-checked={active}
                      tabIndex={enrolled ? -1 : 0}
                      className="flex items-center cursor-pointer"
                      onClick={() => !enrolled && setSelectedStay(opt.key)}
                      onKeyDown={(e) => {
                        if (!enrolled && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          setSelectedStay(opt.key);
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
          )}
        </div>

        <div className="flex flex-col items-end justify-start gap-3 flex-shrink-0">
          {program.brochureUrl && isSafeUrl(program.brochureUrl) && (
            <a
              href={program.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white/80 transition-colors"
            >
              <Download className="w-4 h-4" />
              {t('programme.list.downloadBrochure')}
            </a>
          )}

          {enrolled ? (
            <span className="flex items-center gap-1.5 text-[13px] text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t('programme.list.enrolledLabel')}
            </span>
          ) : (
            <Button
              onClick={() => onEnrol(selectedStay)}
              disabled={enrolling}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-5 h-9 font-medium disabled:opacity-70"
            >
              {enrolling ? t('programme.list.enrollingButton') : t('programme.list.enrollButton')}
              {!enrolling && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          )}

          {error && (
            <AppAlert
              variant="destructive"
              description={error}
              className="max-w-[220px] text-[11px]"
            />
          )}
        </div>

      </div>
    </div>
  );
}
