'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppModal from '@/components/ui/app-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n';
import {
  providerService,
  type InvoiceCompany,
  type InvoiceCompanyInput,
  type ProgramInvoice,
} from '@/services/provider.service';
import type { Program } from '@/types/program';

interface ProgramInvoiceModalProps {
  program: Program | null;
  onClose: () => void;
}

interface CompanyForm {
  gstin: string;
  stateCode: string;
  stateName: string;
  discountPercent: string;
}

const EMPTY_FORM: CompanyForm = { gstin: '', stateCode: '', stateName: '', discountPercent: '0' };

const formatRupees = (paise: number) =>
  (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProgramInvoiceModal({ program, onClose }: ProgramInvoiceModalProps) {
  const [companies, setCompanies] = useState<InvoiceCompany[]>([]);
  const [forms, setForms] = useState<Record<string, CompanyForm>>({});
  const [invoices, setInvoices] = useState<ProgramInvoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!program) return;
    setForms({});
    providerService.getInvoiceCompanies(program._id).then(setCompanies).catch(() => setCompanies([]));
    providerService.listProgramInvoices(program._id).then(setInvoices).catch(() => setInvoices([]));
  }, [program]);

  const formFor = (companyOrgId: string): CompanyForm => forms[companyOrgId] ?? EMPTY_FORM;

  const updateField = (companyOrgId: string, field: keyof CompanyForm, value: string) =>
    setForms((prev) => ({
      ...prev,
      [companyOrgId]: { ...formFor(companyOrgId), [field]: value },
    }));

  const handleGenerate = async () => {
    if (!program) return;

    const payload: InvoiceCompanyInput[] = [];
    for (const company of companies) {
      const form = formFor(company.companyOrgId);
      const discountPercent = Number(form.discountPercent);
      if (!form.gstin.trim() || !/^\d{2}$/.test(form.stateCode.trim()) || !form.stateName.trim()
        || Number.isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        toast.error(t('providerDashboard.invoices.generateErrorToast'));
        return;
      }
      payload.push({
        companyOrgId: company.companyOrgId,
        gstin: form.gstin.trim(),
        stateCode: form.stateCode.trim(),
        stateName: form.stateName.trim(),
        discountPercent,
      });
    }

    setLoading(true);
    try {
      const invoice = await providerService.generateProgramInvoice(program._id, { companies: payload });
      toast.success(t('providerDashboard.invoices.generatedToast', { number: invoice.invoiceNumber }));
      setInvoices((prev) => [invoice, ...prev]);
      setCompanies([]);
      setForms({});
      providerService.getInvoiceCompanies(program._id).then(setCompanies).catch(() => setCompanies([]));
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? t('providerDashboard.invoices.generateErrorToast'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice: ProgramInvoice) => {
    try {
      const blob = await providerService.downloadInvoicePdf(invoice._id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('providerDashboard.invoices.downloadErrorToast'));
    }
  };

  return (
    <AppModal isOpen={!!program} title={t('providerDashboard.invoices.modalTitle')} onClose={onClose}>
      {program && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-white/60">{t('providerDashboard.invoices.modalDescription')}</p>

          {companies.length === 0 ? (
            <p className="text-sm text-white/50">{t('providerDashboard.invoices.noBillable')}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {companies.map((company) => {
                const form = formFor(company.companyOrgId);
                return (
                  <div key={company.companyOrgId} className="rounded-lg border border-white/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{company.companyName}</span>
                      <span className="text-xs text-white/60">
                        {t('providerDashboard.invoices.billableCount', { count: company.billableCount })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input className="h-9 text-sm" placeholder={t('providerDashboard.invoices.buyerGstin')} value={form.gstin} onChange={(e) => updateField(company.companyOrgId, 'gstin', e.target.value)} disabled={loading} />
                      <Input className="h-9 text-sm" placeholder={t('providerDashboard.invoices.buyerStateCode')} maxLength={2} value={form.stateCode} onChange={(e) => updateField(company.companyOrgId, 'stateCode', e.target.value)} disabled={loading} />
                      <Input className="h-9 text-sm" placeholder={t('providerDashboard.invoices.buyerStateName')} value={form.stateName} onChange={(e) => updateField(company.companyOrgId, 'stateName', e.target.value)} disabled={loading} />
                      <Input className="h-9 text-sm" type="number" min={0} max={100} placeholder={t('providerDashboard.invoices.discountPercent')} value={form.discountPercent} onChange={(e) => updateField(company.companyOrgId, 'discountPercent', e.target.value)} disabled={loading} />
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <Button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2">
                  {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {t('providerDashboard.invoices.generateCta')}
                </Button>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-textMuted mb-2">
              {t('providerDashboard.invoices.listTitle')}
            </p>
            {invoices.length === 0 ? (
              <p className="text-sm text-white/50">{t('providerDashboard.invoices.listEmpty')}</p>
            ) : (
              <ul className="flex flex-col divide-y divide-white/10">
                {invoices.map((invoice) => (
                  <li key={invoice._id} className="flex items-center justify-between py-2.5">
                    <div className="text-sm">
                      <span className="font-semibold text-white">{invoice.invoiceNumber}</span>
                      <span className="ml-2 text-white/60">
                        {invoice.companies.map((c) => c.companyName).join(', ')}
                      </span>
                      <span className="ml-2 text-white/60">Rs. {formatRupees(invoice.totalPaise)}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(invoice)}>
                      {t('providerDashboard.invoices.download')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </AppModal>
  );
}
