// Types for bulk user import flow

export interface BulkUser {
  /** Temporary client-side ID for tracking rows */
  _rowId: string;
  email: string;
  role: string;
  action: string;
  status: 'Valid' | 'Error' | 'Warning';
  note: string;
  /** Original row data for reference */
  username?: string;
  password?: string;
  description?: string;
  /** Validation errors per field */
  errors?: Record<string, string>;
}

export interface ImportResults {
  success: boolean;
  totalSubmitted: number;
  createdCount: number;
  approvedCount?: number;
  roleUpdatedCount?: number;
  skippedCount?: number;
  errorMessage?: string;
}

export interface ParsedFileData {
  users: BulkUser[];
  fileName: string;
}

export type BulkImportStep = 'upload' | 'preview' | 'roles' | 'review' | 'results';
