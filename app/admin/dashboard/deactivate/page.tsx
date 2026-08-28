'use client';

import { useState } from 'react';
import { Search, AlertCircle, Pencil } from 'lucide-react';
import { COLOR_CLASSES } from '@/constants/admin';
import { useUsersSearch, UserSearchResult } from '@/hooks/useUsersSearch';
import { t } from '@/lib/i18n';
import PaginationController from '@/components/ui/pagination';
import { TableRowsSkeleton } from '@/components/ui/skeleton';
import EditEmployeeModal from '@/components/admin/EditEmployeeModal';


import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { AppAvatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Keys are lowercased role labels as returned by searchUsersService's
// deriveDisplayRole (admin.service.ts) — "CTD"/"Manager"/etc. aren't
// orgRole values, they're derived from officeRoles/hierarchy, so they're
// matched here by their display text rather than a fixed enum. One CTD and
// one OSD Officer per org — no Junior/Senior tiers, so no separate label
// for those anymore.
const ROLE_COLORS: Record<string, string> = {
  employee: 'bg-[#1e3a8a]/40 ring-1 ring-[#1e3a8a]',
  manager: 'bg-[#9a3412]/40 ring-1 ring-[#9a3412]',
  ctd: 'bg-[#a16207]/40 ring-1 ring-[#a16207]',
  'osd officer': 'bg-[#0e7490]/40 ring-1 ring-[#0e7490]',
  'training provider': 'bg-[#166534]/40 ring-1 ring-[#166534]',
  admin: 'bg-[#be123c]/40 ring-1 ring-[#be123c]',
  default: 'bg-[#4c1d95]/40 ring-1 ring-[#4c1d95]'
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  employee: 'bg-blue-500/10 text-blue-400',
  manager: 'bg-orange-500/10 text-orange-400',
  ctd: 'bg-yellow-500/10 text-yellow-400',
  'osd officer': 'bg-cyan-500/10 text-cyan-400',
  'training provider': 'bg-green-500/10 text-green-400',
  admin: 'bg-rose-500/10 text-rose-400',
  default: 'bg-purple-500/10 text-purple-400'
};

export default function DeactivateUserPage() {
  const { users, loading, error, page, totalPages, searchUsers, goToPage, deactivateUser, activateUser } = useUsersSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchQuery);
    setSelectedUser(null);
    setIsConfirming(false);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setIsConfirming(false);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    const name = selectedUser.username;
    const isActive = selectedUser.status === 'active';
    const success = isActive
      ? await deactivateUser(selectedUser.id)
      : await activateUser(selectedUser.id);
    if (success) {
      toast.success(t(isActive ? 'admin.deactivate.toastDeactivated' : 'admin.deactivate.toastActivated', { name }));
      setSelectedUser(null);
      setIsConfirming(false);
      // Refresh the list
      searchUsers(searchQuery);
    } else {
      toast.error(t(isActive ? 'admin.deactivate.toastDeactivateError' : 'admin.deactivate.toastActivateError', { name }));
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const personCell = (p?: { name: string; email: string } | null) =>
    p ? (
      <div>
        <p className="text-[13px] text-white/80">{p.name}</p>
        <p className="text-[11px] text-white/40">{p.email}</p>
      </div>
    ) : (
      <span className="text-white/25">—</span>
    );

  return (
    <div className={`h-full flex flex-col ${COLOR_CLASSES.BG_MAIN}`}>
      <div className="w-full px-8 pt-8 pb-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white mb-2">
            {t('admin.deactivate.title')}
          </h1>
          <p className="text-[13px] text-white/50 leading-relaxed">
            {t('admin.deactivate.description')}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/30" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.deactivate.searchPlaceholder')}
              className="w-full bg-[#111827] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="bg-transparent border border-white/10 text-white/30 hover:bg-white/5 hover:text-white/50 px-6 font-medium"
            disabled={loading}
          >
            {t('admin.deactivate.searchButton')}
          </Button>
        </form>

        {/* Selected User Action Card */}
        {selectedUser && (() => {
          const isActive = selectedUser.status === 'active';
          const accentBtnClass = isActive ? 'bg-white/90 hover:bg-white' : 'bg-emerald-500 hover:bg-emerald-400';
          const submitBtnClass = isActive ? 'bg-white hover:bg-white/90' : 'bg-emerald-500 hover:bg-emerald-400';
          const dialogBgClass = isActive ? 'bg-[#241111] border-red-900/30' : 'bg-[#0f2418] border-emerald-900/30';

          return (
            <div className="mb-10 bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AppAvatar initials={getInitials(selectedUser.username)} size="lg" className={ROLE_COLORS[(selectedUser.role || '').toLowerCase()] || ROLE_COLORS.default} />
                  <div>
                    <h3 className="text-base font-medium text-white">{selectedUser.username}</h3>
                    <p className="text-sm text-white/50">{selectedUser.email}</p>
                  </div>
                </div>

                {!isConfirming && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setEditingUserId(selectedUser.id)}
                      variant="outline"
                      className="border-white/10 text-white/70 hover:bg-white/5 text-sm px-4 py-5 rounded-lg font-medium"
                    >
                      <Pencil size={14} className="mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setIsConfirming(true)}
                      className={`text-black text-sm px-6 py-5 rounded-lg font-medium ${accentBtnClass}`}
                    >
                      {isActive ? t('admin.deactivate.deactivateAccount') : t('admin.deactivate.activateAccount')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Confirmation Dialog */}
              {isConfirming && (
                <div className={`border-t p-5 mx-2 mb-2 rounded-xl flex items-center justify-between ${dialogBgClass}`}>
                  <div>
                    {isActive ? (
                      <>
                        <p className="text-sm font-medium text-white/90">
                          <span className="text-red-400">{t('admin.deactivate.confirmDeactivateTitle', { name: selectedUser.username })}</span>
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          {t('admin.deactivate.confirmDeactivateBody')}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-white/90">
                          <span className="text-emerald-400">{t('admin.deactivate.confirmActivateTitle', { name: selectedUser.username })}</span>
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          {t('admin.deactivate.confirmActivateBody')}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setIsConfirming(false)}
                      className="text-white/50 hover:text-white hover:bg-white/5"
                    >
                      {t('admin.deactivate.cancel')}
                    </Button>
                    <Button
                      onClick={handleToggleStatus}
                      disabled={loading}
                      className={`text-black px-6 font-medium ${submitBtnClass}`}
                    >
                      {isActive ? t('admin.deactivate.confirmDeactivateSubmit') : t('admin.deactivate.confirmActivateSubmit')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Search Results Table */}
        <div>
          <h3 className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-4">{t('admin.deactivate.resultsHeading')}</h3>

          <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnUser')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnRole')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnReportingManager')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnSkipL1')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnSkipL2')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.deactivate.columnStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRowsSkeleton rows={6} columns={6} />
                ) : error ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={6} className="p-8 text-center text-red-400/80 text-sm">{error}</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={6} className="p-8 text-center text-white/30 text-sm">{t('admin.deactivate.noResults')}</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className={`border-white/5 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-white/[0.03] hover:bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AppAvatar initials={getInitials(user.username)} size="sm" className={ROLE_COLORS[(user.role || '').toLowerCase()] || ROLE_COLORS.default} />
                          <div>
                            <p className="text-sm font-medium text-white/90">{user.username}</p>
                            <p className="text-[12px] text-white/40">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${ROLE_BADGE_COLORS[(user.role || '').toLowerCase()] || ROLE_BADGE_COLORS.default}`}>
                          {user.role || t('admin.deactivate.defaultRole')}
                        </span>
                      </TableCell>

                      <TableCell>{personCell(user.reportingManager)}</TableCell>
                      <TableCell>{personCell(user.skipLevel1Manager)}</TableCell>
                      <TableCell>{personCell(user.skipLevel2Manager)}</TableCell>

                      <TableCell>
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                            {t('admin.deactivate.statusActive')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                            {t('admin.deactivate.statusDeactivated')}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && !error && users.length > 0 && (
            <div className="mt-4">
              <PaginationController
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </div>

      {editingUserId && (
        <EditEmployeeModal
          employeeId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onSaved={() => {
            setEditingUserId(null);
            searchUsers(searchQuery);
          }}
        />
      )}
    </div>
  );
}
