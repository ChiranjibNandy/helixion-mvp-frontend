'use client';

import { Role } from '@/types/role';
import { ROLES } from '@/constants/role';
import { t } from '@/lib/i18n';

interface Props {
   name: string;
   email: string;
   role: Role | '';
   onRoleChange: (role: Role) => void;
}

export function ApproveModalContent({
   name,
   email,
   role,
   onRoleChange,
}: Props) {
   return (
      <div className="flex flex-col gap-4">
         <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs text-white/40 mt-0.5">{email}</p>
         </div>

         <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white">
               {t('admin.approveUser.assignRole')}
            </label>

            <select
               aria-label="role"
               value={role}
               onChange={(e) => onRoleChange(e.target.value as Role)}
               className="w-full rounded-xl bg-transparent border border-blue-500/60 text-white text-sm px-4 py-2.5 outline-none cursor-pointer appearance-none"
            >
               <option value="" disabled hidden>
                  {t('admin.approveUser.selectRole')}
               </option>

               {ROLES.map((r) => (
                  <option
                     key={r}
                     value={r}
                     className="bg-[#1a1b25] text-white"
                  >
                     {r}
                  </option>
               ))}
            </select>

            <p className="text-xs text-white/40">
               {t('admin.approveUser.roleHelp')}
            </p>
         </div>
      </div>
   );
}