'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import {
  providerService,
  type InvoiceCompanyDetail,
  type ProgramInvoice,
} from '@/services/provider.service';

interface Tab {
  key: string;
  source: 'preview' | 'generated';
  invoiceId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  company: InvoiceCompanyDetail;
}

const formatRupees = (paise: number) =>
  (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function ProgramInvoicesPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params?.id as string;

  const [provider, setProvider] = useState<ProgramInvoice['provider'] | null>(null);
  const [program, setProgram] = useState<ProgramInvoice['program'] | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeCompanyOrgId, setActiveCompanyOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const nextTabs: Tab[] = [];

    try {
      const invoices = await providerService.listProgramInvoices(programId);
      invoices.forEach((invoice) => {
        invoice.companies.forEach((company) => {
          nextTabs.push({
            key: `${invoice._id}-${company.companyOrgId}`,
            source: 'generated',
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            company,
          });
        });
      });
      if (invoices[0]) {
        setProvider(invoices[0].provider);
        setProgram(invoices[0].program);
      }
    } catch {
      // no generated invoices yet — fine, the live preview below may still have data
    }

    try {
      const previews = await providerService.getInvoicePreviewData(programId);
      previews.forEach((preview) => {
        preview.companies.forEach((company) => {
          nextTabs.push({
            key: `preview-${company.companyOrgId}`,
            source: 'preview',
            invoiceNumber: 'PREVIEW',
            invoiceDate: preview.invoiceDate,
            company,
          });
        });
      });
      if (previews[0]) {
        setProvider(previews[0].provider);
        setProgram(previews[0].program);
      }
    } catch {
      // every company may already be invoiced — that's fine if generated tabs exist
    }

    setTabs(nextTabs);
    setActiveCompanyOrgId((current) => current ?? nextTabs[0]?.company.companyOrgId ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (programId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const matchingTabs = tabs.filter((tab) => tab.company.companyOrgId === activeCompanyOrgId);
  const activeTab = matchingTabs.find((tab) => tab.source === 'generated') ?? matchingTabs[0] ?? null;
  const companyTabs = Array.from(new Map(tabs.map((tab) => [tab.company.companyOrgId, tab])).values());

  const handleGenerate = async () => {
    if (!activeCompanyOrgId) return;
    setBusy(true);
    try {
      const invoice = await providerService.generateProgramInvoice(programId, activeCompanyOrgId);
      toast.success(t('providerDashboard.invoices.generatedToast', { number: invoice.invoiceNumber }));
      await load();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? t('providerDashboard.invoices.generateErrorToast'));
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const blob = await providerService.downloadInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('providerDashboard.invoices.downloadErrorToast'));
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-textSidebarMuted">Loading…</div>;
  }

  if (tabs.length === 0 || !program || !provider) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit">
          <ChevronLeft size={14} /> Back to programs
        </button>
        <p className="text-sm text-textSidebarMuted">{t('providerDashboard.invoices.noBillable')}</p>
      </div>
    );
  }

  const company = activeTab?.company;

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit">
          <ChevronLeft size={14} /> Back to programs
        </button>
        <h1 className="text-lg font-semibold text-white mt-2">Invoices · {program.title}</h1>
        <p className="text-xs text-textSidebarMuted mt-1">
          {formatDate(program.startDate)} – {formatDate(program.endDate)} · {[program.venue, program.city].filter(Boolean).join(', ')} · {companyTabs.length} companies
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {companyTabs.map((tab) => (
          <button
            key={tab.company.companyOrgId}
            onClick={() => setActiveCompanyOrgId(tab.company.companyOrgId)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              activeTab?.company.companyOrgId === tab.company.companyOrgId
                ? 'bg-primary text-white border-primary'
                : 'text-textSidebarMuted border-white/10 hover:border-white/30'
            }`}
          >
            {tab.company.companyName}
          </button>
        ))}
      </div>

      {activeTab && company && (
        <>
          <div className="rounded-xl bg-bgCard border border-borderCard p-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <p className="text-sm text-textSidebarMuted">{provider.name}</p>
                <h2 className="text-xl font-bold text-white">TAX INVOICE</h2>
              </div>
              <div className="text-right text-sm text-textSidebarMuted">
                <p>Invoice No: <span className="font-semibold text-white">{activeTab.invoiceNumber}</span></p>
                <p>Invoice Date: <span className="font-semibold text-white">{formatDate(activeTab.invoiceDate)}</span></p>
                <p>Place of Supply: <span className="font-semibold text-white">{company.stateName || '-'}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-textMuted mb-1">From (Training Provider)</p>
                <p className="font-semibold text-white">{provider.name}</p>
                <p className="text-sm text-textSidebarMuted">GSTIN: {provider.gstin} · PAN: {provider.pan}</p>
                <p className="text-sm text-textSidebarMuted">State: {provider.stateName} ({provider.stateCode})</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-textMuted mb-1">Bill To (Company)</p>
                <p className="font-semibold text-white">{company.companyName}</p>
                <p className="text-sm text-textSidebarMuted">GSTIN: {company.gstin || '-'} · State: {company.stateName || '-'} ({company.stateCode || '-'})</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 rounded-lg bg-bgButton p-3 mb-5 text-sm">
              <div>
                <p className="text-xs text-textMuted uppercase tracking-widest">Training Program</p>
                <p className="text-white font-medium">{program.title}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase tracking-widest">Dates</p>
                <p className="text-white font-medium">{formatDate(program.startDate)} – {formatDate(program.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase tracking-widest">Venue</p>
                <p className="text-white font-medium">{[program.venue, program.city].filter(Boolean).join(', ') || '-'}</p>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-textMuted border-b border-white/10">
                  <th className="pb-2 pr-2">#</th>
                  <th className="pb-2 pr-2">Participant</th>
                  <th className="pb-2 pr-2">Stay Type</th>
                  <th className="pb-2 pr-2 text-center">Days Attended</th>
                  <th className="pb-2 pr-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {company.lines.map((line, index) => (
                  <tr key={line.enrollmentId} className="border-b border-white/5">
                    <td className="py-2 pr-2 text-textSidebarMuted">{index + 1}</td>
                    <td className="py-2 pr-2">
                      <p className="text-white">{line.participantName}</p>
                      <p className="text-xs text-textSidebarMuted">{line.designation || '-'}</p>
                    </td>
                    <td className="py-2 pr-2 text-textSidebarMuted">{line.stayType.replace(/_/g, ' ')}</td>
                    <td className="py-2 pr-2 text-center text-textSidebarMuted">{line.daysPresent} / {line.totalDays}</td>
                    <td className="py-2 pr-2 text-right text-textSidebarMuted">₹{formatRupees(line.feePaise)}</td>
                    <td className="py-2 text-right text-white">₹{formatRupees(line.feePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <div className="w-64 text-sm">
                <div className="flex justify-between py-1 text-textSidebarMuted"><span>Subtotal</span><span>₹{formatRupees(company.subtotalPaise)}</span></div>
                {company.discountPaise > 0 && (
                  <div className="flex justify-between py-1 text-textSidebarMuted"><span>Discount ({company.discountPercent}%)</span><span>-₹{formatRupees(company.discountPaise)}</span></div>
                )}
                <div className="flex justify-between py-1 text-textSidebarMuted"><span>Taxable value</span><span>₹{formatRupees(company.taxablePaise)}</span></div>
                {company.igstPaise > 0 ? (
                  <div className="flex justify-between py-1 text-textSidebarMuted"><span>IGST</span><span>₹{formatRupees(company.igstPaise)}</span></div>
                ) : (
                  <>
                    <div className="flex justify-between py-1 text-textSidebarMuted"><span>CGST</span><span>₹{formatRupees(company.cgstPaise)}</span></div>
                    <div className="flex justify-between py-1 text-textSidebarMuted"><span>SGST</span><span>₹{formatRupees(company.sgstPaise)}</span></div>
                  </>
                )}
                <div className="flex justify-between py-2 border-t border-white/10 mt-1 font-semibold text-white"><span>Total</span><span>₹{formatRupees(company.totalPaise)}</span></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-textSidebarMuted">
              {activeTab.source === 'preview'
                ? 'Preview · not yet generated'
                : `Generated · ${activeTab.invoiceNumber}`}
            </p>
            <div className="flex gap-2">
              {activeTab.source === 'preview' ? (
                <Button onClick={handleGenerate} disabled={busy} className="flex items-center gap-2">
                  {busy && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Generate Invoice
                </Button>
              ) : (
                <Button onClick={() => handleDownload(activeTab.invoiceId!, activeTab.invoiceNumber)}>
                  Export PDF ({company.companyName})
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
