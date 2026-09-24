import * as XLSX from 'xlsx';

/**
 * Universal file parser supporting .csv, .xls, and .xlsx files.
 * Returns an array of raw objects mapping header names to row values.
 */
export async function parseSpreadsheetFile(file: File): Promise<Record<string, any>[]> {
   const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
   const allowedExtensions = ['.csv', '.xls', '.xlsx'];

   if (!allowedExtensions.includes(extension)) {
      throw new Error('Unsupported file type — only .csv, .xls, and .xlsx are supported.');
   }

   const buffer = await file.arrayBuffer();
   // cellDates: true helps parse date fields nicely if present
   const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

   if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('File contains no readable sheets.');
   }

   const firstSheetName = workbook.SheetNames[0];
   const worksheet = workbook.Sheets[firstSheetName];

   if (!worksheet) {
      throw new Error('Unable to read worksheet contents.');
   }

   // Convert sheet to JSON objects using header row
   const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: '',
      raw: false,
   });

   // Clean and trim header keys for every row to handle accidental whitespace
   return rawRows.map((row) => {
      const cleaned: Record<string, any> = {};
      for (const key of Object.keys(row)) {
         cleaned[key.trim()] = row[key];
      }
      return cleaned;
   });
}