'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { isSafeUrl } from '@/utils/validators';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

interface BrochureDownloadLinkProps {
  url: string;
  /** Used for the saved file's name, e.g. the program title. */
  fileName?: string;
  className?: string;
}

const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04]; // "PK\x03\x04"

// Magic-byte signatures for the brochure formats providers upload.
const SIGNATURES: { ext: string; bytes: number[] }[] = [
  { ext: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: 'jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: 'doc', bytes: [0xd0, 0xcf, 0x11, 0xe0] }, // legacy OLE2 Office
];

// docx/pptx/xlsx are all zip containers sharing ZIP_SIGNATURE; they're told
// apart by their top-level folder, whose name appears uncompressed in the
// zip's local file headers near the start of the file.
const OFFICE_ZIP_FOLDERS: { ext: string; folder: string }[] = [
  { ext: 'docx', folder: 'word/' },
  { ext: 'pptx', folder: 'ppt/' },
  { ext: 'xlsx', folder: 'xl/' },
];
const ZIP_SCAN_BYTES = 64 * 1024;

const startsWith = (head: Uint8Array, bytes: number[]) => bytes.every((b, i) => head[i] === b);

const extensionFromUrl = (url: string) => {
  const last = new URL(url).pathname.split('/').pop() || '';
  const match = last.match(/\.([a-z0-9]{2,5})$/i);
  return match ? match[1].toLowerCase() : null;
};

const sniffExtension = async (blob: Blob) => {
  const head = new Uint8Array(await blob.slice(0, 8).arrayBuffer());

  if (startsWith(head, ZIP_SIGNATURE)) {
    const scanned = new TextDecoder('latin1').decode(await blob.slice(0, ZIP_SCAN_BYTES).arrayBuffer());
    return OFFICE_ZIP_FOLDERS.find(({ folder }) => scanned.includes(folder))?.ext ?? 'zip';
  }

  return SIGNATURES.find(({ bytes }) => startsWith(head, bytes))?.ext ?? null;
};

const sanitizeFileName = (name: string) =>
  name.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim() || 'brochure';

/**
 * Downloads a program brochure with a usable file name.
 *
 * Brochures are uploaded to Cloudinary as `raw` resources with a random
 * public_id and no extension, so a plain <a href> saves a file like
 * "o6vjhy2ojcu7slfnuape" that the OS can't open. We fetch the file
 * (Cloudinary serves it with CORS `*`), detect its real type from its
 * first bytes, and save it as "<Program title>.pdf". Cloudinary refusals
 * (e.g. 401 "deny or ACL failure" on blocked PDF delivery) surface as a
 * toast instead of opening a broken tab.
 */
export function BrochureDownloadLink({ url, fileName, className }: BrochureDownloadLinkProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isSafeUrl(url)) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        toast.error(t('programme.list.brochureUnavailable'));
        return;
      }
      const blob = await res.blob();
      const ext = extensionFromUrl(url) ?? (await sniffExtension(blob)) ?? 'pdf';
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${sanitizeFileName(fileName || 'brochure')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      // Network/CORS failure — fall back to letting the browser open it.
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="link"
      onClick={handleDownload}
      disabled={downloading}
      className={cn(
        'h-auto p-0 gap-1.5 text-[13px] font-normal text-white/55 hover:text-white/80 hover:no-underline disabled:opacity-60',
        className
      )}
    >
      {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
      {downloading ? t('programme.list.downloadingBrochure') : t('programme.list.downloadBrochure')}
    </Button>
  );
}
