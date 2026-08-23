'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import AppModal from '@/components/ui/app-modal';
import { TextField, Checkbox } from '@/components/shared/FormFields';
import { useEmployeeDetail } from '@/hooks/useEmployeeDetail';
import { useUpdateEmployee } from '@/hooks/useUpdateEmployee';
import { t } from '@/lib/i18n';

interface FormState {
  name: string;
  email: string;
  employeeCode: string;
  mobile: string;
  placeOfPosting: string;
  designation: string;
  department: string;
  reportingManagerEmail: string;
  skip1Email: string;
  skip2Email: string;
  trainingDeptSeniorOfficer: boolean;
  osdSeniorOfficer: boolean;
  isManager: boolean;
}

const EMPTY_STATE: FormState = {
  name: '',
  email: '',
  employeeCode: '',
  mobile: '',
  placeOfPosting: '',
  designation: '',
  department: '',
  reportingManagerEmail: '',
  skip1Email: '',
  skip2Email: '',
  trainingDeptSeniorOfficer: false,
  osdSeniorOfficer: false,
  isManager: false,
};

interface EditEmployeeModalProps {
  employeeId: string;
  onClose: () => void;
  /** Called after a successful save so the caller can refresh its list. */
  onSaved: (name: string) => void;
}

export default function EditEmployeeModal({ employeeId, onClose, onSaved }: EditEmployeeModalProps) {
  const { employee, loading: fetchLoading, error: fetchError } = useEmployeeDetail(employeeId);
  const { updateEmployee, loading: saving, error: saveError } = useUpdateEmployee();

  const [form, setForm] = useState<FormState>(EMPTY_STATE);

  useEffect(() => {
    if (!employee) return;
    setForm({
      name: employee.name || '',
      email: employee.email || '',
      employeeCode: employee.employeeCode || '',
      mobile: employee.mobile || '',
      placeOfPosting: employee.placeOfPosting || '',
      designation: employee.designation || '',
      department: employee.department || '',
      reportingManagerEmail: employee.reportingManagerEmail || '',
      skip1Email: employee.skip1Email || '',
      skip2Email: employee.skip2Email || '',
      trainingDeptSeniorOfficer: !!employee.trainingDeptSeniorOfficer,
      osdSeniorOfficer: !!employee.osdSeniorOfficer,
      isManager: !!employee.isManager,
    });
  }, [employee]);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit = form.name.trim().length > 0 && form.email.trim().length > 0 && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // This form always submits its full current state — every field below
    // is present on every save, never a partial patch — so blanking a field
    // must actually clear it server-side, not vanish as `undefined` (which
    // the backend's PATCH contract treats as "field not touched, leave
    // as-is"). employeeCode is the one deliberate exception: it's a unique
    // roll number, so an empty value is left out here (preserving the
    // existing one) rather than clearing a required identifier.
    const ok = await updateEmployee(employeeId, {
      name: form.name,
      email: form.email,
      employeeCode: form.employeeCode || undefined,
      mobile: form.mobile,
      placeOfPosting: form.placeOfPosting,
      designation: form.designation,
      department: form.department,
      reportingManagerEmail: form.reportingManagerEmail,
      skip1Email: form.skip1Email,
      skip2Email: form.skip2Email,
      trainingDeptSeniorOfficer: form.trainingDeptSeniorOfficer,
      osdSeniorOfficer: form.osdSeniorOfficer,
      isManager: form.isManager,
    });

    if (ok) {
      toast.success(t('admin.editEmployee.successToast', { name: form.name }));
      onSaved(form.name);
    }
  };

  return (
    <AppModal isOpen onClose={onClose} className="max-w-4xl" title={employee ? t('admin.editEmployee.titleWithName', { name: employee.name }) : t('admin.editEmployee.title')}>
      {fetchLoading ? (
        <div className="py-10 text-center text-sm text-white/40">{t('admin.editEmployee.loading')}</div>
      ) : fetchError || !employee ? (
        <div className="flex items-start gap-3 py-6">
          <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={16} />
          <p className="text-sm text-accentRed">{fetchError || t('admin.editEmployee.notFound')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{t('admin.editEmployee.statusLabel')} {employee.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">{t('admin.editEmployee.basicDetails')}</h3>

              <div className="grid grid-cols-2 gap-3">
                <TextField label="Name" required value={form.name} onChange={(v) => setField('name', v)} placeholder="Jane Doe" />
                <TextField label="Email" required value={form.email} onChange={(v) => setField('email', v)} placeholder="jane@corp.in" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextField label="Employee Roll No." value={form.employeeCode} onChange={(v) => setField('employeeCode', v)} />
                <TextField label="Mobile" value={form.mobile} onChange={(v) => setField('mobile', v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextField label="Place of Posting" value={form.placeOfPosting} onChange={(v) => setField('placeOfPosting', v)} />
                <TextField label="Designation" value={form.designation} onChange={(v) => setField('designation', v)} />
              </div>

              <TextField label="Department" value={form.department} onChange={(v) => setField('department', v)} />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">{t('admin.editEmployee.reportingManager')}</h3>
              <TextField
                label="Reporting Manager Email (optional)"
                value={form.reportingManagerEmail}
                onChange={(v) => setField('reportingManagerEmail', v)}
                placeholder="manager@corp.in"
              />
              <TextField
                label="Skip Level 1 Manager Email (optional)"
                value={form.skip1Email}
                onChange={(v) => setField('skip1Email', v)}
                placeholder="skip1@corp.in"
              />
              <TextField
                label="Skip Level 2 Manager Email (optional)"
                value={form.skip2Email}
                onChange={(v) => setField('skip2Email', v)}
                placeholder="skip2@corp.in"
              />

              <h3 className="text-sm font-semibold text-white pt-1">{t('admin.editEmployee.officeRoles')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <Checkbox label={t('admin.editEmployee.managerLabel')} checked={form.isManager} onChange={(v) => setField('isManager', v)} />
                <Checkbox label={t('admin.editEmployee.ctdLabel')} checked={form.trainingDeptSeniorOfficer} onChange={(v) => setField('trainingDeptSeniorOfficer', v)} />
                <Checkbox label={t('admin.editEmployee.osdLabel')} checked={form.osdSeniorOfficer} onChange={(v) => setField('osdSeniorOfficer', v)} />
              </div>
            </div>
          </div>

          {saveError && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accentRed/10 border border-accentRed/20">
              <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={14} />
              <p className="text-sm text-accentRed">{saveError}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {t('admin.editEmployee.cancel')}
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primaryDark
                         transition-all duration-200 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {t('admin.editEmployee.saveChanges')}
            </button>
          </div>
        </form>
      )}
    </AppModal>
  );
}
