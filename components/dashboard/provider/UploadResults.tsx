'use client';

import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { BulkUploadError } from '@/services/provider.service';

interface UploadResultsProps {
  uploadResult: {
    insertedCount: number;
    failedCount: number;
    errors: BulkUploadError[];
  };
  onReset: () => void;
}

export default function UploadResults({ uploadResult, onReset }: UploadResultsProps) {
  const errorColumns = [
    {
      key: 'row',
      header: 'Row',
      render: (err: BulkUploadError) => (
        <span className="text-sm font-medium">{err.row}</span>
      ),
    },
    {
      key: 'issues',
      header: 'Issues',
      render: (err: BulkUploadError) => (
        <ul className="list-disc list-inside text-sm">
          {err.errors.map((e, i) => (
            <li key={i} className="text-red-400">
              <span className="font-medium text-white/70">{e.path}</span>:{' '}
              {e.message}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium mb-0.5 text-slate-200">
          {t('bulkProgram.sectionTitle')}
        </h2>
        <p className="text-xs text-white/50">
          {t('bulkProgram.sectionDescription')}
        </p>
      </div>

      <div className="w-full bg-[#111827] rounded-xl border border-white/5 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-slate-200">
            {t('bulkProgram.resultsTitle')}
          </h3>
          <Button variant="ghost" onClick={onReset}>
            {t('bulkProgram.uploadAnother')}
          </Button>
        </div>

        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-white/70">
              {t('bulkProgram.programsCreated', {
                count: uploadResult.insertedCount,
              })}
            </span>
          </div>
          {uploadResult.failedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-sm text-white/70">
                {t('bulkProgram.rowsFailed', { count: uploadResult.failedCount })}
              </span>
            </div>
          )}
        </div>

        {uploadResult.errors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-400 mb-2">
              {t('bulkProgram.rowErrors')}
            </h4>
            <DataTable data={uploadResult.errors} columns={errorColumns} />
          </div>
        )}
      </div>
    </div>
  );
}
