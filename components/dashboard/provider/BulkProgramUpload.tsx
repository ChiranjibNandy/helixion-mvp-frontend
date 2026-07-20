'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FileDropzone from '@/components/shared/FileDropzone';
import AppModal from '@/components/ui/app-modal';
import { Button } from '@/components/ui/button';
import { providerService, BulkUploadResult } from '@/services/provider.service';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { PROGRAM_CSV_COLUMNS, OPTIONAL_CSV_COLUMNS, SAMPLE_CSV_ROW } from '@/constants/provider';


import UploadHeader from './UploadHeader';
import UploadDropzone from './UploadDropzone';
import UploadPreview from './UploadPreview';
import UploadResults from './UploadResults';
import { ROUTES } from '@/constants/navigation';

export default function BulkProgramUpload() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error(t('bulkProgram.errorInvalidFile'));
      return;
    }

    setIsProcessing(true);
    setSelectedFile(file);
    setUploadResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 5, // Only preview the first 5 rows
      complete: (results) => {
        setIsProcessing(false);
        if (results.errors.length > 0 && results.data.length === 0) {
          toast.error(t('bulkProgram.errorParseFailed'));
          return;
        }
        if (results.data.length === 0) {
          toast.error(t('bulkProgram.errorEmptyFile'));
          return;
        }

        const headers = results.meta?.fields || [];
        for (const col of PROGRAM_CSV_COLUMNS) {
          if (!(OPTIONAL_CSV_COLUMNS as readonly string[]).includes(col) && !headers.includes(col)) {
            alert('please fill all the required fields');
            return;
          }
        }

        let hasMissingFields = false;
        for (const row of results.data as any[]) {
          if (!row || typeof row !== 'object') continue;
          for (const col of PROGRAM_CSV_COLUMNS) {
            if (!(OPTIONAL_CSV_COLUMNS as readonly string[]).includes(col)) {
              const val = row[col];
              if (val === undefined || val === null || String(val).trim() === '') {
                hasMissingFields = true;
                break;
              }
            }
          }
          if (hasMissingFields) break;
        }

        if (hasMissingFields) {
          alert('please fill all the required fields');
          return;
        }

        setPreviewData(results.data);
      },
      error: (error) => {
        setIsProcessing(false);
        toast.error(t('bulkProgram.errorParseFailed'));
        console.error(error);
      },
    });
  };

  const handlePublish = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const response = await providerService.bulkUploadPrograms(selectedFile);
      const result = response.data;
      setUploadResult(result);
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t('bulkProgram.errorUploadFailed')
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setUploadResult(null);
    setShowSuccessModal(false);
  };

  const handleDownloadSample = () => {
    const csvContent = `${PROGRAM_CSV_COLUMNS.join(',')}\n${SAMPLE_CSV_ROW}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_programs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Build modal stats and description from upload result
  const modalStats = uploadResult
    ? [
      {
        label: t('bulkProgram.programsCreated', {
          count: uploadResult.insertedCount,
        }),
        variant: 'green' as const,
      },
      ...(uploadResult.failedCount > 0
        ? [
          {
            label: t('bulkProgram.rowsFailed', {
              count: uploadResult.failedCount,
            }),
            variant: 'orange' as const,
          },
        ]
        : []),
    ]
    : [];

  const modalDescription = uploadResult
    ? uploadResult.failedCount > 0
      ? t('bulkProgram.partialSuccessDescription', {
        inserted: uploadResult.insertedCount,
        failed: uploadResult.failedCount,
      })
      : t('bulkProgram.successDescription', {
        count: uploadResult.insertedCount,
      })
    : '';

  return (
    <div className="w-full flex flex-col text-white font-sans">
      <AppModal
        isOpen={showSuccessModal}
        type="success"
        title={t('bulkProgram.successTitle')}
        description={modalDescription}
        stats={modalStats}
        doneLabel={t('button.done')}
        onDone={() => {
          handleReset();
          router.push(ROUTES.PROVIDER.PROGRAMS.DRAFTS);
        }}
      />

      <UploadHeader onDownloadSample={handleDownloadSample} />

      {uploadResult ? (
        <UploadResults uploadResult={uploadResult} onReset={handleReset} />
      ) : selectedFile && previewData.length > 0 ? (
        <UploadPreview
          fileName={selectedFile.name}
          previewData={previewData}
          isUploading={isUploading}
          onCancel={handleReset}
          onPublish={handlePublish}
        />
      ) : (
        <UploadDropzone
          isProcessing={isProcessing}
          onFileSelected={handleFileSelected}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
}
