'use client';

import PageHeader from '@/components/ui/pageHeader';
import { t } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { downloadSampleTemplate } from '@/utils/downloadTemplate';
import { PROGRAM_CSV_COLUMNS, SAMPLE_PROGRAM_ROWS } from '@/constants/provider';


export default function UploadHeader({
}) {
  return (
    <div className="flex justify-between items-start mb-8">
      <PageHeader
        title={t('bulkProgram.pageTitle')}
        description={t('bulkProgram.breadcrumb')}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
          {t('bulkProgram.trySample')}
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => downloadSampleTemplate('csv', PROGRAM_CSV_COLUMNS, SAMPLE_PROGRAM_ROWS, 'sample_programs')}>
            {t('bulkProgram.sampleCsv')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => downloadSampleTemplate('xls', PROGRAM_CSV_COLUMNS, SAMPLE_PROGRAM_ROWS, 'sample_programs')}>
            {t('bulkProgram.sampleXls')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => downloadSampleTemplate('xlsx', PROGRAM_CSV_COLUMNS, SAMPLE_PROGRAM_ROWS, 'sample_programs')}>
            {t('bulkProgram.sampleXlsx')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}