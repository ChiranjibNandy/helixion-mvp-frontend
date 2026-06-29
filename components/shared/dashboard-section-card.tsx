import { ReactNode } from "react";

interface DashboardSectionCardProps {
   title: string;
   subtitle?: string;
   count?: number;
   action?: ReactNode;
   children: ReactNode;
}

export function DashboardSectionCard({
   title,
   subtitle,
   count,
   action,
   children,
}: DashboardSectionCardProps) {
   return (
      <div className="bg-bgCard border border-borderCard rounded-lg overflow-hidden flex flex-col h-full">
         <div className="flex items-center justify-between p-4">
            <div>
               <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg font-semibold">
                     {title}
                  </h2>
                  {count !== undefined && (
                     <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bgStatCard text-textSidebarMuted text-xs font-semibold">
                        {count}
                     </span>
                  )}
               </div>

               {subtitle && (
                  <p className="text-textSidebarMuted text-xs mt-1">
                     {subtitle}
                  </p>
               )}
            </div>

            {action}
         </div>

         {children}
      </div>
   );
}
