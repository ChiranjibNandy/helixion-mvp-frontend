//dowload template for bulk upload user
import * as XLSX from 'xlsx';

const TEMPLATE_HEADERS = [
  'Employee Roll No.',
  'Name of the employee',
  'Email',
  'Mobile',
  'Place of Posting',
  'Designation',
  'Department',
  'Manager',
  'Training Department Officer (CTD)',
  'OSD Officer',
  'Reporting Manager Email',
  'Skip Level 1 Manager Email',
  'Skip Level 2 Manager Email',
];

const SAMPLE_ROWS = [
  [
    'E1001',
    'Arjun Mehta',
    'arjun@corp.in',
    '9876543210',
    'Mumbai',
    'Analyst',
    'Finance',
    'No',
    'No',
    'No',
    'manager@corp.in',
    '',
    '',
  ],
  [
    'E1002',
    'Sara Iyer',
    'sara@corp.in',
    '9876543211',
    'Delhi',
    'Senior Analyst',
    'Finance',
    'Yes',
    'No',
    'No',
    'manager@corp.in',
    'skiplevel1@corp.in',
    '',
  ],
];

export function downloadSampleTemplate(format: 'csv' | 'xlsx' | 'xls') {
  const worksheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, ...SAMPLE_ROWS]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  const fileName = `employee_bulk_upload_template.${format}`;

  if (format === 'csv') {
    XLSX.writeFile(workbook, fileName, { bookType: 'csv' });
  } else if (format === 'xls') {
    XLSX.writeFile(workbook, fileName, { bookType: 'biff8' });
  } else {
    XLSX.writeFile(workbook, fileName, { bookType: 'xlsx' });
  }
}