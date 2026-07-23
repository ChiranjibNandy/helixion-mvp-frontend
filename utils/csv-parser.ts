import { BulkUser } from '@/types/bulk-import';
import { t } from '@/lib/i18n';

/**
 * Valid roles and actions for CSV validation.
 * Must match the backend's actual User.orgRole schema enum
 * (helixion-mvp-backend/src/constants/enum.ts, ORG_ROLE) — "provider" and
 * "manager" were previously accepted here but rejected by the backend,
 * silently failing every row that used them.
 */
const VALID_ROLES = ['employee', 'training_provider', 'admin'];
const VALID_ACTIONS = ['approve', 'update'];

/**
 * Parse a single CSV line, handling quoted values correctly.
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
 * Parse CSV text into an array of BulkUser objects.
 * Validates roles, actions, and assigns status/notes per row.
 */
export function parseCSV(text: string): BulkUser[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const emailIdx = headers.findIndex((h) =>
    ['email', 'email_address', 'email address', 'mail'].includes(h)
  );
  const roleIdx = headers.findIndex((h) =>
    ['role', 'user_role', 'user role'].includes(h)
  );
  const actionIdx = headers.findIndex((h) =>
    ['action', 'act'].includes(h)
  );

  if (emailIdx === -1) {
    throw new Error(t('bulkImport.upload.errorCsvNoEmail'));
  }

  const users: BulkUser[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const email = values[emailIdx]?.trim() || '';
    const role = roleIdx !== -1 ? (values[roleIdx]?.trim() || '') : '';
    const action = actionIdx !== -1 ? (values[actionIdx]?.trim() || 'approve') : 'approve';

    if (!email) continue;

    let status: BulkUser['status'] = 'Valid';
    let note = t('bulkImport.review.noteValid');

    const roleLower = role.toLowerCase();
    const actionLower = action.toLowerCase();

    if (!VALID_ROLES.includes(roleLower) && role !== '') {
      status = 'Error';
      note = t('bulkImport.review.noteInvalidRole');
    } else if (!VALID_ACTIONS.includes(actionLower)) {
      status = 'Error';
      note = t('bulkImport.review.noteInvalidAction');
    } else if (actionLower === 'update') {
      status = 'Warning';
      const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
      note = t('bulkImport.review.noteRoleChange', { role: capitalizedRole });
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
 * Format byte count to human-readable file size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
