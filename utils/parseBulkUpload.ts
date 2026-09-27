import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Universal file parser supporting .csv, .xls, and .xlsx files.
 * Returns an array of objects mapping header names to row values.
 */
export async function parseSpreadsheetFile(
   file: File
): Promise<Record<string, any>[]> {
   const extension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();

   const allowedExtensions = ['.csv', '.xls', '.xlsx'];

   if (!allowedExtensions.includes(extension)) {
      throw new Error(
         'Unsupported file type — only .csv, .xls, and .xlsx are supported.'
      );
   }

   // CSV — use Papa Parse
   if (extension === '.csv') {
      return new Promise((resolve, reject) => {
         Papa.parse<Record<string, any>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
               if (results.errors.length > 0) {
                  reject(new Error('Unable to parse the CSV file.'));
                  return;
               }

               const rows = results.data.map((row) => {
                  const cleaned: Record<string, any> = {};

                  Object.entries(row).forEach(([key, value]) => {
                     cleaned[key.trim()] =
                        typeof value === 'string' ? value.trim() : value;
                  });

                  return cleaned;
               });

               resolve(rows);
            },
            error: () => {
               reject(new Error('Unable to parse the CSV file.'));
            },
         });
      });
   }

   // XLS / XLSX
   const buffer = await file.arrayBuffer();

   const workbook = XLSX.read(buffer, {
      type: 'array',
      cellDates: true,
   });

   if (!workbook.SheetNames.length) {
      throw new Error('File contains no readable sheets.');
   }

   const firstSheetName = workbook.SheetNames[0];

   if (!firstSheetName) {
      throw new Error('Unable to read worksheet.');
   }

   const worksheet = workbook.Sheets[firstSheetName];

   if (!worksheet) {
      throw new Error('Unable to read worksheet contents.');
   }

   const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: '',
      raw: true,
   });

   return rawRows.map((row) => {
      const cleaned: Record<string, any> = {};

      Object.entries(row).forEach(([key, value]) => {
         cleaned[key.trim()] = formatExcelValue(value);
      });

      return cleaned;
   });
}

/**
 * Converts Excel Date values to YYYY-MM-DD.
 */
function formatExcelValue(value: unknown): unknown {
   if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
   }

   return typeof value === 'string' ? value.trim() : value;
}