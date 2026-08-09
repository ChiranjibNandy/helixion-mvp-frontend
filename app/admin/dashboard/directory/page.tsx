'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEmployeeDirectory, DirectoryEmployee } from '@/hooks/useEmployeeDirectory';
import { AppAlert } from '@/components/shared/app-alert';
import { Spinner } from '@/components/ui/spinner';

const PAGE_SIZE = 10;

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-rose-500/10 text-rose-400',
  manager: 'bg-orange-500/10 text-orange-400',
  ctd: 'bg-yellow-500/10 text-yellow-400',
  'training dept officer': 'bg-yellow-500/10 text-yellow-400',
  'osd senior': 'bg-cyan-500/10 text-cyan-400',
  'osd officer': 'bg-cyan-500/10 text-cyan-400',
  'training provider': 'bg-green-500/10 text-green-400',
  employee: 'bg-blue-500/10 text-blue-400',
  default: 'bg-purple-500/10 text-purple-400',
};
const badge = (role: string) => ROLE_BADGE[(role || '').toLowerCase()] || ROLE_BADGE.default;

const personCell = (p: { name: string; email: string } | null) =>
  p ? (
    <div>
      <div className="text-sm text-white/90">{p.name}</div>
      <div className="text-[11px] text-white/40">{p.email}</div>
    </div>
  ) : (
    <span className="text-white/25">—</span>
  );

export default function EmployeeDirectoryPage() {
  const { employees, loading, error } = useEmployeeDirectory();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Distinct roles present in the org, for the filter dropdown.
  const roles = useMemo(
    () => Array.from(new Set(employees.map((e) => e.role).filter(Boolean))).sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return employees.filter((e) => {
      if (roleFilter !== 'all' && e.role !== roleFilter) return false;
      if (!t) return true;
      return (
        e.name?.toLowerCase().includes(t) ||
        e.email?.toLowerCase().includes(t) ||
        e.role?.toLowerCase().includes(t) ||
        e.department?.toLowerCase().includes(t) ||
        e.reportingManager?.name?.toLowerCase().includes(t)
      );
    });
  }, [employees, q, roleFilter]);

  // Reset to first page whenever the filters change the result set.
  useEffect(() => {
    setPage(1);
  }, [q, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="text-primary" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
          <p className="text-sm text-white/40">
            Everyone in your organization — their role, reporting chain, and skip-level managers.
          </p>
        </div>
      </div>

      {error && <AppAlert variant="destructive" title="Error" description={error} />}

      {/* Search + role filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, manager…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-bgStatCard border border-borderCard text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-2 px-3 rounded-lg bg-bgStatCard border border-borderCard text-sm text-white focus:outline-none focus:border-primary/50 cursor-pointer [&>option]:bg-[#0d0f1a]"
        >
          <option value="all">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="rounded-xl border border-borderCard overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-[10px] font-semibold uppercase tracking-widest text-white/35">
                  <tr>
                    <th className="text-left px-4 py-3">Employee</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Reporting Manager (L0)</th>
                    <th className="text-left px-4 py-3">Skip Level 1</th>
                    <th className="text-left px-4 py-3">Skip Level 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pageRows.map((e: DirectoryEmployee) => (
                    <tr key={e.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">{e.name}</div>
                        <div className="text-[11px] text-white/40">{e.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${badge(e.role)}`}>{e.role}</span>
                      </td>
                      <td className="px-4 py-3">{personCell(e.reportingManager)}</td>
                      <td className="px-4 py-3">{personCell(e.skipLevel1Manager)}</td>
                      <td className="px-4 py-3">{personCell(e.skipLevel2Manager)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                        {employees.length === 0 ? 'No employees yet — add or bulk-upload some first.' : 'No matches for your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borderCard bg-bgStatCard hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="px-2 text-white/70">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-borderCard bg-bgStatCard hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
