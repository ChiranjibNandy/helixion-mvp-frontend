import { SidebarFooterProps, SidebarMenuProps, SidebarNavItemProps, SidebarProfileProps, SidebarProps } from '../../props/sidebar';
import { ROLE_LABEL } from '../../constants/employee';
import Link from 'next/link';
import { Award, BarChart3, Bell, BookOpen, ClipboardCheck, Download, FileText, LayoutDashboard, MessageSquare, Plane, PlusCircle, Search, Settings, Shield, Upload, UploadCloud, User, UserCircle, Users, Zap, KeyRound, LogOut } from 'lucide-react';
import { NavItem } from '@/types';
import { AppAvatar } from './avatar';
import CountBadge from './count-badge';
import ThemeSwitch from './theme-switcher';


//  ICON MAP (IMPORTANT)
const ICON_MAP: Record<string, any> = {
  'book-open': BookOpen,
  search: Search,
  award: Award,
  'user-circle': UserCircle,
  'layout-dashboard': LayoutDashboard,
  'bar-chart': BarChart3,
  users: Users,
  shield: Shield,
  file: FileText,
  'file-text': FileText,
  settings: Settings,
  zap: Zap,
  bell: Bell,
  "key-round": KeyRound,
  'plus-circle': PlusCircle,
  'upload-cloud': UploadCloud,
  upload: Upload,
  download: Download,
  'clipboard-check': ClipboardCheck,
  'bar-chart-3': BarChart3,
  user: User,
  plane: Plane,
  'messageSquare': MessageSquare
};




// ─── Logo seen in above of sidebar component ────────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-3.5 border-b border-borderCard">
      <div className="w-6.5 h-6.5 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-[10px] font-semibold text-primary-foreground flex-shrink-0">
        Hx
      </div>
      <span className="text-[13px] font-semibold text-foreground tracking-tight">
        Helixon
      </span>
    </div>
  );
}





// ─── Profile of use with name location and role ────────────────────────────────────────────────────────────────
function SidebarProfile({ user }: SidebarProfileProps) {
  return (
    <div className="px-3.5 py-3 border-b border-borderCard">
      <AppAvatar
        initials={user.name.slice(0, 1)}
        size="md"
        className="mb-2"
      />
      <p className="text-[12px] font-semibold text-foreground leading-tight">
        {user.name}
      </p>
      <p className="text-[10px] text-textSidebar mt-0.5">
        {user.location}
      </p>
      <p className="text-[9px] text-muted-foreground mt-0.5">
        {ROLE_LABEL[user.role]}
      </p>
    </div>
  );
}


// ─── Component ────────────────────────────────────────────────────────────────
function SidebarNavItem({ item, isActive, onClick }: any) {
  const baseClass = `
    flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
    cursor-pointer transition-colors duration-150 mb-0.5 select-none
    ${isActive
      ? "bg-primary/10 text-primary"
      : "text-textSidebar hover:text-primary hover:bg-primary/10"
    }
  `;

  // ✅ Convert string → component
  const Icon = item.icon ? ICON_MAP[item.icon] : null;

  const inner = (
    <>
      {Icon && (
        <Icon
          className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-primary" : "text-current"
            }`}
        />
      )}

      <span className="flex-1">{item.label}</span>

      {item.badge != null && item.badge > 0 && (
        <CountBadge count={item.badge} variant="blue" />
      )}
    </>
  );

  // Disabled items (e.g. gated behind an org-dependent setup step) render as
  // non-interactive — no Link, no onClick — with a native title tooltip
  // explaining why, instead of being hidden entirely.
  if (item.disabled) {
    return (
      <div
        className={`${baseClass} !cursor-not-allowed !text-textSidebarMuted hover:!bg-transparent`}
        title={item.disabledReason}
      >
        {inner}
      </div>
    );
  }

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
    <nav className="flex-1 min-h-0 px-2.5 py-3 overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={section.category} className={idx > 0 ? 'mt-3' : ''}>
          <p className="text-[9px] font-semibold tracking-widest uppercase text-textSidebarMuted px-1 mb-1.5">
            {section.category}
          </p>
          {section.items.map((item: NavItem) => (
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

function SidebarTheme() {
  return (
    <div className="px-3.5">
        <ThemeSwitch />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
function SidebarFooter({ onSignOut }: SidebarFooterProps) {
  return (
    <div className="px-3.5 py-2.5 border-t border-borderCard">
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] text-accentRed cursor-pointer transition-colors duration-150 hover:bg-accentRed/10"
      >
        <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar({ user, navSections, activeKey, onNavChange, onSignOut }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full min-h-0 overflow-hidden bg-background border-r border-borderCard">
      <SidebarLogo />
      <SidebarProfile user={user} />
      <SidebarMenu
        sections={navSections}
        activeKey={activeKey}
        onNavChange={onNavChange}
      />
      <SidebarTheme />
      <SidebarFooter onSignOut={onSignOut} />
    </aside>
  );
}