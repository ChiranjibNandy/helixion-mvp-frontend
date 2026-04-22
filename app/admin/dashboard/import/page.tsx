'use client';

import BulkImportWizard from '@/components/dashboard/bulk-import/BulkImportWizard';

/**
 * Admin Bulk Import page
 * Multi-step wizard: Upload → Preview → Assign Roles → Review → Submit → Results
 */
export default function BulkImportPage() {
  return (
    <div className="pb-8">
      <BulkImportWizard />
    </div>
  );
}
