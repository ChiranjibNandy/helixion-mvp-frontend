'use client';

import FileDropzone from '@/components/shared/FileDropzone';
import { t } from '@/lib/i18n';
import React from 'react';

interface UploadDropzoneProps {
  isProcessing: boolean;
  onFileSelected: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function UploadDropzone({
  isProcessing,
  onFileSelected,
  fileInputRef,
}: UploadDropzoneProps) {
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

      <div className="w-full bg-[#111827] rounded-xl border border-white/5 px-6 py-10 shadow-lg">
        <FileDropzone
          accept=".csv,.xls,.xlsx"
          onFileSelected={onFileSelected}
          isProcessing={isProcessing}
          fileInputRef={fileInputRef}
          label={
            <span className="font-medium text-slate-200">
              {t('bulkProgram.dropLabel')}
            </span>
          }
          hint={t('bulkProgram.expectedColumns')}
        />

        <p className="text-[11px] text-white/30 mt-5 text-center px-2">
          {t('bulkProgram.footerHint')}
        </p>
      </div>
    </div>
  );
}