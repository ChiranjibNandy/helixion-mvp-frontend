'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  /** Accepted file types for the input, e.g. ".csv" */
  accept: string;
  /** Called when a file is selected (via drop or click) */
  onFileSelected: (file: File) => void;
  /** Whether the file is currently being processed */
  isProcessing: boolean;
  /** Main label displayed in the dropzone */
  label: React.ReactNode;
  /** Hint text below the label */
  hint?: string;
  /** Ref for the hidden file input */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** Unique ID for the file input */
  inputId?: string;
}

/**
 * Reusable file dropzone component.
 * Handles drag-and-drop and click-to-browse interactions.
 * Delegates file processing to the parent via onFileSelected callback.
 */
export default function FileDropzone({
  accept,
  onFileSelected,
  isProcessing,
  label,
  hint,
  fileInputRef,
  inputId = 'file-dropzone-input',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }, [onFileSelected]);

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
    if (e.target) e.target.value = '';
    if (file) onFileSelected(file);
  }, [onFileSelected]);

  return (
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
          : 'border-borderCard hover:border-primary/40 hover:bg-muted/50'
        }
        ${isProcessing ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id={inputId}
      />

      <div className="flex flex-col items-center gap-3">
        <div className={`
          w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
          ${isDragging ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-primary/10'}
        `}>
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload
              className={`transition-colors ${isDragging ? 'text-primary' : 'text-textSidebarMuted group-hover:text-primary/60'}`}
              size={20}
            />
          )}
        </div>

        <div>
          <p className="text-sm text-textSidebar">{label}</p>
          {hint && (
            <p className="text-xs text-textSidebarMuted mt-1">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
