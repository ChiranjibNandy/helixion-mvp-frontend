import { Download } from 'lucide-react';
import { isSafeUrl } from '@/utils/validators';
import { t } from '@/lib/i18n';

interface BrochureDownloadLinkProps {
  url: string;
}

export function BrochureDownloadLink({ url }: BrochureDownloadLinkProps) {
  if (!isSafeUrl(url)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white/80 transition-colors"
    >
      <Download className="w-4 h-4" />
      {t('programme.list.downloadBrochure')}
    </a>
  );
}
