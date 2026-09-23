'use client';

import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/pageHeader';
import { t } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface UploadHeaderProps {
  onDownloadSample: (format: 'csv' | 'xls' | 'xlsx') => void;
}

export default function UploadHeader({
  onDownloadSample,
}: UploadHeaderProps) {
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
          <DropdownMenuItem onSelect={() => onDownloadSample('csv')}>
            {t('bulkProgram.sampleCsv')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDownloadSample('xls')}>
            {t('bulkProgram.sampleXls')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDownloadSample('xlsx')}>
            {t('bulkProgram.sampleXlsx')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}