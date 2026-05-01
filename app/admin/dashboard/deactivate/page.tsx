'use client';

import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { COLOR_CLASSES } from '@/constants/admin';
import { useUsersSearch, UserSearchResult } from '@/hooks/useUsersSearch';
import { t } from '@/lib/i18n';


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
import { AppAlert } from '@/components/shared/app-alert';

const ROLE_COLORS: Record<string, string> = {
  employee: 'bg-[#1e3a8a]/40 ring-1 ring-[#1e3a8a]',
  provider: 'bg-[#166534]/40 ring-1 ring-[#166534]',
  default: 'bg-[#4c1d95]/40 ring-1 ring-[#4c1d95]'
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  employee: 'bg-blue-500/10 text-blue-400',
  provider: 'bg-green-500/10 text-green-400',
  default: 'bg-purple-500/10 text-purple-400'
};

export default function DeactivateUserPage() {
  const { users, loading, error, searchUsers, deactivateUser } = useUsersSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchQuery);
    setSelectedUser(null);
    setIsConfirming(false);
    setActionSuccess(null);
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setIsConfirming(false);
    setActionSuccess(null);
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    const success = await deactivateUser(selectedUser.id);
    if (success) {
      setActionSuccess(`${selectedUser.username} has been deactivated successfully.`);
      setSelectedUser(null);
      setIsConfirming(false);
      // Refresh the list
      searchUsers(searchQuery);
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

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

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="mb-6">
            <AppAlert
              variant="success"
              description={actionSuccess}
            />
          </div>
        )}

        {/* Warning Alert */}
        <div className="mb-8">
          <AppAlert 
            variant="warning"
            description="Immediate effect. The user is signed out of all sessions and blocked from logging in the moment you confirm."
          />
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
              className="w-full bg-[#111827] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
          <Button 
            type="submit" 
            variant="default"
            className="bg-transparent border border-white/10 text-white/30 hover:bg-white/5 hover:text-white/50 px-6 font-medium"
            disabled={loading}
          >
            Search
          </Button>
        </form>

        {/* Selected User Action Card */}
        {selectedUser && (
          <div className="mb-10 bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AppAvatar initials={getInitials(selectedUser.username)} size="lg" className={ROLE_COLORS[selectedUser.role || 'default'] || ROLE_COLORS.default} />
                <div>
                  <h3 className="text-base font-medium text-white">{selectedUser.username}</h3>
                  <p className="text-sm text-white/50">{selectedUser.email}</p>
                </div>
              </div>
              
              {!isConfirming && (
                <Button 
                  onClick={() => setIsConfirming(true)}
                  className="bg-white/90 hover:bg-white text-black text-sm px-6 py-5 rounded-lg font-medium"
                >
                  Deactivate account
                </Button>
              )}
            </div>

            {/* Confirmation Dialog */}
            {isConfirming && (
              <div className="bg-[#241111] border-t border-red-900/30 p-5 mx-2 mb-2 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">
                    <span className="text-red-400">Deactivate {selectedUser.username}?</span> This cannot be undone instantly.
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    They will be signed out and blocked from login immediately.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsConfirming(false)}
                    className="text-white/50 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeactivate}
                    disabled={loading}
                    className="bg-white hover:bg-white/90 text-black px-6 font-medium"
                  >
                    Yes, deactivate
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Results Table */}
        <div>
          <h3 className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-4">Search results</h3>
          
          <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-12 text-[12px] font-medium text-white/40"></TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">User</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">Role</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">Status</TableHead>
                  <TableHead className="text-[12px] font-medium text-white/40">Last active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={5} className="p-8 text-center text-white/30 text-sm">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={5} className="p-8 text-center text-red-400/80 text-sm">{error}</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={5} className="p-8 text-center text-white/30 text-sm">No users found.</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className={`border-white/5 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-white/[0.03] hover:bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <TableCell className="w-12 text-center">
                        <div className={`w-4 h-4 rounded-full border mx-auto flex items-center justify-center ${selectedUser?.id === user.id ? 'border-red-500' : 'border-white/20'}`}>
                          {selectedUser?.id === user.id && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AppAvatar initials={getInitials(user.username)} size="sm" className={ROLE_COLORS[user.role || 'default'] || ROLE_COLORS.default} />
                          <div>
                            <p className="text-sm font-medium text-white/90">{user.username}</p>
                            <p className="text-[12px] text-white/40">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${ROLE_BADGE_COLORS[user.role || 'default'] || ROLE_BADGE_COLORS.default}`}>
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                            Deactivated
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-[13px] text-white/40">
                        {user.status === 'active' ? '2 hours ago' : '3 weeks ago'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
