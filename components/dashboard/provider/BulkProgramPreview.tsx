import DataTable from '@/components/shared/data-table';
import { t } from '@/lib/i18n';

interface Props {
  previewData: any[];
}

export default function BulkProgramPreview({ previewData }: Props) {
  if (!previewData || previewData.length === 0) return null;

  const previewColumns = Object.keys(previewData[0]).map(key => ({
    key,
    header: key,
    render: (row: any) => <span className="text-sm">{row[key]}</span>
  }));

  return (
    <div className="w-full bg-[#111827] rounded-xl border border-white/5 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-2">{t('bulkProgram.previewData')}</h2>
      <p className="text-sm text-white/50 mb-6">{t('bulkProgram.previewNotice')}</p>
      <DataTable data={previewData} columns={previewColumns} />
    </div>
  );
}
