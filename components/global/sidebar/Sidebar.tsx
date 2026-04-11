import { Avatar } from '../../ui/Avatar';
import { SidebarFooterProps, SidebarMenuProps, SidebarNavItemProps, SidebarProfileProps, SidebarProps } from './Props';
import { ROLE_LABEL } from '../Contant';
import Link from 'next/link';
import { Icon } from 'lucide-react';


// ─── Component ────────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-3.5 border-b border-white/[0.06]">
      <div className="w-6.5 h-6.5 w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
        Hx
      </div>
      <span className="text-[13px] font-semibold text-slate-200 tracking-tight">
        Helixion
      </span>
    </div>
  );
}


// ─── Role Label Map ───────────────────────────────────────────────────────────


// ─── Component ────────────────────────────────────────────────────────────────
function SidebarProfile({ user }: SidebarProfileProps) {
  return (
    <div className="px-3.5 py-3 border-b border-white/[0.06]">
      <Avatar initials={user.name.split('')[0]} size="md" className="mb-2" />
      <p className="text-[12px] font-semibold text-slate-200 leading-tight">
        {user.name}
      </p>
      <p className="text-[10px] text-white/30 mt-0.5">
        {user.location}
      </p>
      <p className="text-[9px] text-white/20 mt-0.5">
        {ROLE_LABEL[user.role]}
      </p>
    </div>
  );
}


// ─── Component ────────────────────────────────────────────────────────────────
function SidebarNavItem({ item, isActive, onClick }: SidebarNavItemProps) {
  const baseClass = `
    flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
    cursor-pointer transition-colors duration-150 mb-0.5 select-none
    ${
      isActive
        ? "bg-blue-900/30 text-blue-300"
        : "text-white/35 hover:text-white/60 hover:bg-white/5"
    }
  `;

  const Icon = item.icon; 

  const inner = (
    <>
      {Icon && (
        <Icon
          className={`w-3.5 h-3.5 flex-shrink-0 ${
            isActive ? "text-blue-400" : "text-current"
          }`}
        />
      )}

      <span>{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={baseClass}
        onClick={() => onClick?.(item.key)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={baseClass} onClick={() => onClick?.(item.key)}>
      {inner}
    </div>
  );
}



// ─── Component ────────────────────────────────────────────────────────────────
function SidebarMenu({ sections, activeKey, onNavChange }: SidebarMenuProps) {
  return (
    <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={section.category} className={idx > 0 ? 'mt-3' : ''}>
          <p className="text-[9px] font-semibold tracking-widest uppercase text-white/25 px-1 mb-1.5">
            {section.category}
          </p>
          {section.items.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              isActive={activeKey === item.key}
              onClick={onNavChange}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}



// ─── Component ────────────────────────────────────────────────────────────────
function SidebarFooter({ onSignOut }: SidebarFooterProps) {
  return (
    <div className="px-3.5 py-2.5 border-t border-white/[0.06]">
      <button
        onClick={onSignOut}
        className="text-[10px] text-white/25 hover:text-white/50 transition-colors duration-150 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar({ user, navSections, activeKey, onNavChange, onSignOut }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-[#080e1a] border-r border-white/[0.06]">
      <SidebarLogo />
      <SidebarProfile user={user} />
      <SidebarMenu
        sections={navSections}
        activeKey={activeKey}
        onNavChange={onNavChange}
      />
      <SidebarFooter onSignOut={onSignOut} />
    </aside>
  );
}