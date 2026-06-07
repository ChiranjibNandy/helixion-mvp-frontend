import { Registration } from '@/types/auth';
import { getInitials } from '@/utils/nameInitial';
import { RegistrationActions } from './registration-actions';

export const getRegistrationColumns = (
  refetch: () => void
) => [
  {
    key: 'user',
    header: 'User',
    render: (row: Registration) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-slate-700 flex items-center justify-center text-xs font-bold">
          {getInitials(row.name)}
        </div>

        <div>
          <p className="text-white text-sm">{row.name}</p>
          <p className="text-textSidebarMuted text-xs">
            {row.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (row: Registration) => (
      <span className="text-textSidebarMuted text-xs">
        {row.date}
      </span>
    ),
  },
  {
    key: 'action',
    header: 'Actions',
    render: (row: Registration) => (
      <RegistrationActions
        user={row}
        refetch={refetch}
      />
    ),
  },
];