'use client';

import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

interface UploadPreviewProps {
  fileName: string;
  previewData: any[];
  isUploading: boolean;
  onCancel: () => void;
  onPublish: () => void;
}

export default function UploadPreview({
  fileName,
  previewData,
  isUploading,
  onCancel,
  onPublish,
}: UploadPreviewProps) {
  const previewColumns =
    previewData.length > 0
      ? Object.keys(previewData[0]).map((key) => ({
          key,
          header: key,
          render: (row: any) => <span className="text-sm">{row[key]}</span>,
        }))
      : [];

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
            {t('bulkProgram.preview', { fileName })}
          </h3>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel} disabled={isUploading}>
              {t('bulkProgram.cancelButton')}
            </Button>
            <Button variant="default" onClick={onPublish} disabled={isUploading}>
              {isUploading
                ? t('bulkProgram.publishing')
                : t('bulkProgram.publishButton')}
            </Button>
          </div>
        </div>

        <DataTable data={previewData} columns={previewColumns} />
      </div>
    </div>
  );
}
