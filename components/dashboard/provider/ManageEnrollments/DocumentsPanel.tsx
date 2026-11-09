import { FileText } from 'lucide-react';
import { DraftProgram } from '@/types';

export default function DocumentsPanel({ program }: { program: DraftProgram }) {
  if (!program.brochureUrl) {
    return <p className="text-sm text-gray-400 py-2">No documents attached to this program.</p>;
  }

  return (
    <div className="py-2">
      <a
        href={program.brochureUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
      >
        <FileText size={14} /> Program Brochure
      </a>
    </div>
  );
}
