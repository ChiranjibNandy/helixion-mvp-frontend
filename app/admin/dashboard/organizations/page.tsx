'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { COLOR_CLASSES } from '@/constants/admin';
import { useOrganizationsList } from '@/hooks/useOrganizationsList';
import { t } from '@/lib/i18n';
import PaginationController from '@/components/ui/pagination';
import { TableRowsSkeleton } from '@/components/ui/skeleton';
import EditOrganizationModal from '@/components/admin/EditOrganizationModal';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const TYPE_BADGE_COLORS: Record<string, string> = {
  corporate: 'bg-blue-500/10 text-blue-400',
  training_provider: 'bg-green-500/10 text-green-400',
  osd_internal: 'bg-cyan-500/10 text-cyan-400',
  default: 'bg-purple-500/10 text-purple-400',
};

const formatOrgType = (orgType: string) =>
  orgType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function OrganizationsPage() {
  const { organizations, loading, error, page, totalPages, search, goToPage } = useOrganizationsList();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchQuery);
  };

  return (
    <div className={`h-full flex flex-col ${COLOR_CLASSES.BG_MAIN}`}>
      <div className="w-full px-8 pt-8 pb-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white mb-2">
            {t('admin.organizations.title')}
          </h1>
          <p className="text-[13px] text-white/50 leading-relaxed">
            {t('admin.organizations.description')}
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
              placeholder={t('admin.organizations.searchPlaceholder')}
              className="w-full bg-[#111827] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="bg-transparent border border-white/10 text-white/30 hover:bg-white/5 hover:text-white/50 px-6 font-medium"
            disabled={loading}
          >
            {t('admin.organizations.searchButton')}
          </Button>
        </form>

        {/* Organizations Table */}
        <div>
          <h3 className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-4">
            {t('admin.organizations.resultsHeading')}
          </h3>

          <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.organizations.columnName')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.organizations.columnSlug')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.organizations.columnType')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.organizations.columnStatus')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">{t('admin.organizations.columnCreated')}</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40 text-right">{t('admin.organizations.columnActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRowsSkeleton rows={6} columns={6} />
                ) : error ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={6} className="p-8 text-center text-red-400/80 text-sm">{error}</TableCell>
                  </TableRow>
                ) : organizations.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={6} className="p-8 text-center text-white/30 text-sm">{t('admin.organizations.noResults')}</TableCell>
                  </TableRow>
                ) : (
                  organizations.map((org) => (
                    <TableRow key={org.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell>
                        <p className="text-sm font-medium text-white/90">{org.name}</p>
                      </TableCell>

                      <TableCell>
                        <span className="text-[12px] text-white/40">{org.slug}</span>
                      </TableCell>

                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${TYPE_BADGE_COLORS[org.orgType] || TYPE_BADGE_COLORS.default}`}>
                          {formatOrgType(org.orgType)}
                        </span>
                      </TableCell>

                      <TableCell>
                        {org.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                            {t('admin.organizations.statusActive')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                            {t('admin.organizations.statusInactive')}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-[13px] text-white/40">{formatDate(org.createdAt)}</span>
                      </TableCell>

                      <TableCell className="text-right">
                        <button
                          onClick={() => setEditingOrgId(org.id)}
                          className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {t('admin.organizations.editAction')}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && !error && organizations.length > 0 && (
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

      {editingOrgId && (
        <EditOrganizationModal
          organizationId={editingOrgId}
          onClose={() => setEditingOrgId(null)}
          onSaved={() => {
            setEditingOrgId(null);
            search(searchQuery);
          }}
        />
      )}
    </div>
  );
}
