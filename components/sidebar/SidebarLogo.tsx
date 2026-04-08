// ─── Component ────────────────────────────────────────────────────────────────
export function SidebarLogo() {
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