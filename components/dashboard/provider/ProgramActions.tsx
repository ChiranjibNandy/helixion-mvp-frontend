import { Copy } from 'lucide-react';
import { t } from '@/lib/i18n';

interface Props {
  onDuplicate: () => void;
}

export default function ProgramActions({ onDuplicate }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/80 bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
        onClick={onDuplicate}
      >
        <Copy size={14} />{t('programme.list.duplicateButton')}
      </button>
    </div>
  );
}
