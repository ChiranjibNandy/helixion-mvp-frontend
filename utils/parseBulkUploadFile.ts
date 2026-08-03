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
  trainingDeptJunior: boolean;
  trainingDeptSenior: boolean;
  osdJunior: boolean;
  osdSenior: boolean;
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
const isYes = (v: unknown) => typeof v === 'string' && v.trim().toLowerCase() === 'yes';

function toRow(raw: Record<string, any>, idx: number): BulkEmployeeRow {
  const str = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());
  return {
    _rowId: `row-${idx}`,
    employeeCode: str(raw['Employee Roll No.']),
    name: str(raw['Name of the employee']),
    email: str(raw['Email']).toLowerCase(),
    mobile: str(raw['Mobile']),
    placeOfPosting: str(raw['Place of Posting']),
    designation: str(raw['Designation']),
    department: str(raw['Department']),
    trainingDeptJunior: isYes(raw['Training Department Junior Officer']),
    trainingDeptSenior: isYes(raw['Training Department Senior Officer']),
    osdJunior: isYes(raw['OSD Team Junior Officer']),
    osdSenior: isYes(raw['OSD Team Senior Officer']),
    reportingManagerEmail: str(raw['Reporting Manager Email']).toLowerCase(),
    skipLevel1ManagerEmail: str(raw['Skip Level 1 Manager Email']).toLowerCase(),
    skipLevel2ManagerEmail: str(raw['Skip Level 2 Manager Email']).toLowerCase(),
  };
}

async function parseCsvFile(file: File): Promise<Record<string, any>[]> {
  const text = await file.text();
  const result = Papa.parse<Record<string, any>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

async function parseExcelFile(file: File): Promise<Record<string, any>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
}

/** Parses a .csv, .xls, or .xlsx bulk-upload file into row objects. */
export async function parseBulkUploadFile(file: File): Promise<BulkEmployeeRow[]> {
  const name = file.name.toLowerCase();
  let raw: Record<string, any>[];

  if (name.endsWith('.csv')) {
    raw = await parseCsvFile(file);
  } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    raw = await parseExcelFile(file);
  } else {
    throw new Error('Unsupported file type — only .csv, .xls, and .xlsx are supported.');
  }

  return raw.map(toRow);
}

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
      escalate('error', `Duplicate Employee Roll No. "${row.employeeCode}" — used by ${codeCounts.get(row.employeeCode)} rows`);
    }

    if (!row.name) {
      escalate('warning', 'Missing name');
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
