'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppModal from '@/components/ui/app-modal';
import { providerService, BulkUploadResult } from '@/services/provider.service';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { PROGRAM_CSV_COLUMNS, OPTIONAL_CSV_COLUMNS } from '@/constants/provider';
import UploadHeader from './UploadHeader';
import UploadDropzone from './UploadDropzone';
import UploadPreview from './UploadPreview';
import UploadResults from './UploadResults';
import { ROUTES } from '@/constants/navigation';
import { parseSpreadsheetFile } from '@/utils/parseBulkUpload';

export default function BulkProgramUpload() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setUploadResult(null);
    setShowSuccessModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // const parseFileRows = async (file: File, extension: string): Promise<any[]> => {
  //   if (extension === '.csv') {
  //     return new Promise((resolve, reject) => {
  //       Papa.parse(file, {
  //         header: true,
  //         skipEmptyLines: 'greedy',
  //         transformHeader: (h) => h.trim(),
  //         complete: (results) => {
  //           if (results.errors.length > 0 && results.data.length === 0) {
  //             reject(new Error('Failed to parse CSV file.'));
  //           } else {
  //             resolve(results.data);
  //           }
  //         },
  //         error: reject,
  //       });
  //     });
  //   }

  //   // Process XLS / XLSX formats
  //   const buffer = await file.arrayBuffer();
  //   const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

  //   if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
  //     throw new Error('Excel file contains no readable sheets.');
  //   }

  //   const firstSheetName = workbook.SheetNames[0];
  //   const worksheet = workbook.Sheets[firstSheetName];

  //   if (!worksheet) {
  //     throw new Error('Unable to read Excel sheet contents.');
  //   }

  //   // Convert worksheet to JSON objects using header row
  //   return XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
  //     defval: '',
  //     raw: false,
  //   });
  // };

  const validateFileContent = (rows: any[]): boolean => {
    if (!rows || rows.length === 0) {
      toast.error(t('bulkProgram.errorEmptyFile'));
      return false;
    }

    const headers = Object.keys(rows[0] || {}).map((h) => h.trim());
    const requiredColumns = PROGRAM_CSV_COLUMNS.filter(
      (col) => !(OPTIONAL_CSV_COLUMNS as readonly string[]).includes(col)
    );

    // Validate presence of required headers
    const missingHeaders = requiredColumns.filter((col) => !headers.includes(col));
    if (missingHeaders.length > 0) {
      toast.error(`Missing required column headers: ${ missingHeaders.join(', ') }`);
      return false;
    }

    // Validate required cell values across all rows
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (!row || typeof row !== 'object') continue;

      for (const col of requiredColumns) {
        const val = row[col];
        if (val === undefined || val === null || String(val).trim() === '') {
          toast.error(`Row ${ rowIndex + 1 } has a missing required field: "${ col }"`);
          return false;
        }
      }
    }

    return true;
  };

  const handleFileSelected = async (file: File) => {
    const extension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();

    const allowedExtensions = ['.csv', '.xls', '.xlsx'];

    if (!allowedExtensions.includes(extension)) {
      toast.error(t('bulkProgram.errorInvalidFile'));
      return;
    }

    setIsProcessing(true);
    setSelectedFile(file);
    setUploadResult(null);

    try {
      const allRows = await parseSpreadsheetFile(file);

      if (!validateFileContent(allRows)) {
        handleReset();
        return;
      }

      // Preview top 5 rows
      setPreviewData(allRows.slice(0, 5));
    } catch (error: any) {
      console.error('File parsing error:', error);
      toast.error(t('bulkProgram.errorParseFailed'));
      handleReset();
    } finally {
      setIsProcessing(false);
    }
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
        title={t('bulkProgram.draftSuccess')}
        description={modalDescription}
        stats={modalStats}
        doneLabel={t('button.done')}
        onDone={() => {
          handleReset();
          router.push(ROUTES.PROVIDER.PROGRAMS.DRAFTS);
        }}
      />

      <UploadHeader  />

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