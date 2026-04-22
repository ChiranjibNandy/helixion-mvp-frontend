'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { BulkUser } from '@/types/bulk-import';

interface StepUploadProps {
  onFileParsed: (users: BulkUser[], fileName: string, fileSize: string, rowCount: number) => void;
}

/**
 * Parse CSV text into an array of BulkUser objects
 */
function parseCSV(text: string): BulkUser[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const emailIdx = headers.findIndex((h) => ['email', 'email_address', 'email address', 'mail'].includes(h));
  const roleIdx = headers.findIndex((h) => ['role', 'user_role', 'user role'].includes(h));
  const actionIdx = headers.findIndex((h) => ['action', 'act'].includes(h));

  if (emailIdx === -1) {
    throw new Error('CSV must contain an "email" column');
  }

  const validRoles = ['employee', 'provider', 'manager', 'admin'];
  const validActions = ['approve', 'update'];
  const users: BulkUser[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const email = values[emailIdx]?.trim() || '';
    const role = roleIdx !== -1 ? (values[roleIdx]?.trim() || '') : '';
    const action = actionIdx !== -1 ? (values[actionIdx]?.trim() || 'approve') : 'approve';

    if (!email) continue;

    // Determine status and note
    let status: BulkUser['status'] = 'Valid';
    let note = 'Pending user found';

    const roleLower = role.toLowerCase();
    const actionLower = action.toLowerCase();

    if (!validRoles.includes(roleLower) && role !== '') {
      // Invalid role but parseable
      status = 'Error';
      note = 'User not found — will be skipped';
    } else if (!validActions.includes(actionLower)) {
      status = 'Error';
      note = 'Invalid action — will be skipped';
    } else if (actionLower === 'update') {
      status = 'Warning';
      // Capitalize role for display
      const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
      note = `Role change: Employee → ${capitalizedRole}`;
    }

    users.push({
      _rowId: `row-${i}`,
      email,
      role,
      action: actionLower,
      status,
      note,
    });
  }

  return users;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

/**
 * Format file size
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function StepUpload({ onFileParsed }: StepUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';

      if (!isCSV) {
        throw new Error('Please upload a CSV file (.csv)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be under 5MB');
      }

      const text = await file.text();
      const users = parseCSV(text);

      if (users.length === 0) {
        throw new Error('No valid data found in the file. Ensure it has an "email" column.');
      }

      if (users.length > 50) {
        throw new Error('Maximum 50 rows allowed per batch. Your file contains ' + users.length + ' rows.');
      }

      const rowCount = text.trim().split(/\r?\n/).length;
      onFileParsed(users, file.name, formatSize(file.size), rowCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          rounded-xl border-2 border-dashed p-10 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-white/10 hover:border-primary/40 hover:bg-white/[0.01]'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="bulk-import-file-input"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`
            w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-primary/10'}
          `}>
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload
                className={`transition-colors ${isDragging ? 'text-primary' : 'text-white/30 group-hover:text-primary/60'}`}
                size={20}
              />
            )}
          </div>

          <div>
            <p className="text-sm text-white/50">
              {isProcessing ? 'Processing file...' : (
                <>
                  Drop <span className="text-primary">.csv</span> file here or <span className="text-primary">click to browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-white/25 mt-1">
              .xlsx available on paid plan · Max 50 rows
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 mt-3 rounded-lg bg-accentRed/10 border border-accentRed/20">
          <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm text-accentRed font-medium">Upload Error</p>
            <p className="text-xs text-accentRed/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
