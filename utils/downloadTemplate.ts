import * as XLSX from 'xlsx';

export function downloadSampleTemplate(
  format: 'csv' | 'xlsx' | 'xls',
  headers: string[],
  rows: (string | number | boolean)[][],
  fileName: string = 'sample_template'
) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const fullFileName = `${fileName}.${format}`;

  if (format === 'csv') {
    XLSX.writeFile(workbook, fullFileName, { bookType: 'csv' });
  } else if (format === 'xls') {
    XLSX.writeFile(workbook, fullFileName, { bookType: 'biff8' });
  } else {
    XLSX.writeFile(workbook, fullFileName, { bookType: 'xlsx' });
  }
}