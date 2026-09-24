import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Column names must match the backend's actual readers exactly —
// helixion-mvp-backend/src/utils/mapSpreadsheetEmployee.ts and
// mapEmployeeHierarchy.ts read these same header strings by name.
export interface BulkEmployeeRow {
  _rowId: string;
  employeeCode: string;
  name: string;
  email: string;
  mobile: string;
  placeOfPosting: string;
  designation: string;
  department: string;
  trainingDeptSenior: boolean;
  osdSenior: boolean;

  isManager: boolean;
  reportingManagerEmail: string;
  skipLevel1ManagerEmail: string;
  skipLevel2ManagerEmail: string;
}

export type RowSeverity = 'valid' | 'warning' | 'error';

export interface ValidatedBulkEmployeeRow extends BulkEmployeeRow {
  severity: RowSeverity;
  issues: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



/**
 * Client-side pre-flight checks — catches the same class of bugs that
 * previously reached the backend as an unhandled crash (duplicate
 * employeeCode) or a silent no-op (a manager email that doesn't resolve to
 * anyone). Manager-email checks can only be verified against emails present
 * IN THIS FILE — a manager already in the target org from a prior upload
 * will correctly show as a warning here even though the real upload will
 * succeed, since this runs with no knowledge of the database.
 */
export function validateBulkEmployeeRows(rows: BulkEmployeeRow[]): ValidatedBulkEmployeeRow[] {
  const codeCounts = new Map<string, number>();
  const emailsInFile = new Set(rows.map((r) => r.email).filter(Boolean));

  for (const row of rows) {
    if (row.employeeCode) {
      codeCounts.set(row.employeeCode, (codeCounts.get(row.employeeCode) ?? 0) + 1);
    }
  }

  return rows.map((row) => {
    const issues: string[] = [];
    let severity: RowSeverity = 'valid';

    const escalate = (level: RowSeverity, message: string) => {
      issues.push(message);
      if (level === 'error' || severity !== 'error') severity = level;
    };

    if (!row.email) {
      escalate('error', 'Missing email');
    } else if (!EMAIL_RE.test(row.email)) {
      escalate('error', 'Invalid email format');
    }

    if (!row.employeeCode) {
      escalate('error', 'Missing Employee Roll No.');
    } else if ((codeCounts.get(row.employeeCode) ?? 0) > 1) {
      escalate(
        'error',
        `Duplicate Employee Roll No. "${row.employeeCode}" — used by ${codeCounts.get(row.employeeCode)} rows`
      );
    }

    if (!row.name) {
      escalate('warning', 'Missing name');
    }

    // Reporting Manager Email is mandatory server-side — the backend
    // rejects any row missing it (see admin.service.ts batchCreateUsersService).
    // Someone with no manager at all (a root/top-of-chain person) has to be
    // created separately via "Add Employee" first, not through this file.
    if (!row.reportingManagerEmail) {
      escalate(
        'error',
        'Missing Reporting Manager Email — every uploaded employee must have a manager. Create a top-of-chain person separately via "Add Employee" first.'
      );
    } else if (row.email && row.reportingManagerEmail === row.email) {
      escalate('error', 'An employee cannot be listed as their own Reporting Manager');
    }

    for (const [label, email] of [
      ['Reporting Manager', row.reportingManagerEmail],
      ['Skip Level 1 Manager', row.skipLevel1ManagerEmail],
      ['Skip Level 2 Manager', row.skipLevel2ManagerEmail],
    ] as const) {
      if (email && !emailsInFile.has(email)) {
        escalate(
          'warning',
          `${label} Email "${email}" is not a row in this file — the link will only work if that person already exists in the org`
        );
      }
    }

    return { ...row, severity, issues };
  });
}

/**
 * Serializes the (possibly hand-edited) preview rows back into a real CSV
 * file — the backend endpoint only accepts multipart file uploads
 * (uploadCsv.single("file")), so edits made in the preview table have to be
 * turned back into a file rather than sent as JSON. Column order/headers
 * must match parseBulkUploadFile's own `toRow` mapping exactly, since both
 * ultimately have to agree with the backend's mapSpreadsheetEmployee.ts.
 */
export function rowsToCsvFile(rows: BulkEmployeeRow[], originalFileName: string): File {
  const yesNo = (v: boolean) => (v ? 'Yes' : 'No');

  const records = rows.map((row) => ({
    'Employee Roll No.': row.employeeCode,
    'Name of the employee': row.name,
    'Email': row.email,
    'Mobile': row.mobile,
    'Place of Posting': row.placeOfPosting,
    'Designation': row.designation,
    'Department': row.department,
    'Training Department Officer (CTD)': yesNo(row.trainingDeptSenior),
    'OSD Officer': yesNo(row.osdSenior),
    'Manager': yesNo(row.isManager),
    'Reporting Manager Email': row.reportingManagerEmail,
    'Skip Level 1 Manager Email': row.skipLevel1ManagerEmail,
    'Skip Level 2 Manager Email': row.skipLevel2ManagerEmail,
  }));

  const csv = Papa.unparse(records);
  const fileName = originalFileName.replace(/\.(csv|xlsx|xls)$/i, '') + '.csv';
  return new File([csv], fileName, { type: 'text/csv' });
}