'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/ui/pageHeader';
import { useCreateSingleUser } from '@/hooks/useCreateSingleUser';
import { ROUTES } from '@/constants/navigation';

interface FormState {
  name: string;
  email: string;
  employeeCode: string;
  mobile: string;
  placeOfPosting: string;
  designation: string;
  department: string;
  reportingManagerEmail: string;
  trainingDeptJuniorOfficer: boolean;
  trainingDeptSeniorOfficer: boolean;
  osdJuniorOfficer: boolean;
  osdSeniorOfficer: boolean;
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  employeeCode: '',
  mobile: '',
  placeOfPosting: '',
  designation: '',
  department: '',
  reportingManagerEmail: '',
  trainingDeptJuniorOfficer: false,
  trainingDeptSeniorOfficer: false,
  osdJuniorOfficer: false,
  osdSeniorOfficer: false,
};

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold tracking-widest uppercase text-white/35 mb-1.5">
        {label}
        {required && <span className="text-accentRed ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white
                   placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-white/20 bg-black/30 accent-primary"
      />
      {label}
    </label>
  );
}

export default function AddEmployeePage() {
  const router = useRouter();
  const { createSingleUser, loading, error } = useCreateSingleUser();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [success, setSuccess] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(null);
  };

  const canSubmit = form.name.trim().length > 0 && form.email.trim().length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await createSingleUser({
      name: form.name,
      email: form.email,
      employeeCode: form.employeeCode || undefined,
      mobile: form.mobile || undefined,
      placeOfPosting: form.placeOfPosting || undefined,
      designation: form.designation || undefined,
      department: form.department || undefined,
      reportingManagerEmail: form.reportingManagerEmail || undefined,
      trainingDeptJuniorOfficer: form.trainingDeptJuniorOfficer,
      trainingDeptSeniorOfficer: form.trainingDeptSeniorOfficer,
      osdJuniorOfficer: form.osdJuniorOfficer,
      osdSeniorOfficer: form.osdSeniorOfficer,
    });

    if (ok) {
      setSuccess(`${form.name} was created successfully.`);
      setForm(INITIAL_STATE);
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-textSidebarMuted">Users</span>
        <span className="text-textSidebarMuted">/</span>
        <span className="text-primary font-medium">Add Employee</span>
      </div>

      <PageHeader
        title="Add Employee"
        description="Create a single employee directly. Unlike bulk upload, a reporting manager is optional here — use this for the one person at the top of your org hierarchy who has nobody above them."
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-xl bg-bgStatCard border border-borderCard p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-white">Basic details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Name" required value={form.name} onChange={(v) => setField('name', v)} placeholder="Jane Doe" />
            <TextField label="Email" required value={form.email} onChange={(v) => setField('email', v)} placeholder="jane@corp.in" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Employee Roll No." value={form.employeeCode} onChange={(v) => setField('employeeCode', v)} placeholder="Auto-generated if left blank" />
            <TextField label="Mobile" value={form.mobile} onChange={(v) => setField('mobile', v)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <TextField label="Place of Posting" value={form.placeOfPosting} onChange={(v) => setField('placeOfPosting', v)} />
            <TextField label="Designation" value={form.designation} onChange={(v) => setField('designation', v)} />
            <TextField label="Department" value={form.department} onChange={(v) => setField('department', v)} />
          </div>
        </div>

        <div className="rounded-xl bg-bgStatCard border border-borderCard p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white mb-1">Reporting manager</h3>
          <p className="text-xs text-textSidebarMuted mb-3">
            Leave blank if this person is at the top of the hierarchy (nobody above them).
          </p>
          <TextField
            label="Reporting Manager Email (optional)"
            value={form.reportingManagerEmail}
            onChange={(v) => setField('reportingManagerEmail', v)}
            placeholder="manager@corp.in"
          />
        </div>

        <div className="rounded-xl bg-bgStatCard border border-borderCard p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white mb-1">Office roles</h3>
          <div className="grid grid-cols-2 gap-3">
            <Checkbox label="Training Dept — Junior Officer" checked={form.trainingDeptJuniorOfficer} onChange={(v) => setField('trainingDeptJuniorOfficer', v)} />
            <Checkbox label="Training Dept — Senior Officer (CTD)" checked={form.trainingDeptSeniorOfficer} onChange={(v) => setField('trainingDeptSeniorOfficer', v)} />
            <Checkbox label="OSD — Junior Officer" checked={form.osdJuniorOfficer} onChange={(v) => setField('osdJuniorOfficer', v)} />
            <Checkbox label="OSD — Senior Officer" checked={form.osdSeniorOfficer} onChange={(v) => setField('osdSeniorOfficer', v)} />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accentRed/10 border border-accentRed/20">
            <AlertCircle className="text-accentRed flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-accentRed">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accentGreen/10 border border-accentGreen/20">
            <CheckCircle2 className="text-accentGreen flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-accentGreen">{success}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.DASHBOARD.ADMIN)}
            className="px-5 py-2.5 text-sm text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            Back to Dashboard
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primaryDark
                       transition-all duration-200 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
