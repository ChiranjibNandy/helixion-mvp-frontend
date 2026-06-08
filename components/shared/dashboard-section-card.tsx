import { ReactNode } from "react";

interface DashboardSectionCardProps {
   title: string;
   subtitle?: string;
   action?: ReactNode;
   children: ReactNode;
}

export function DashboardSectionCard({
   title,
   subtitle,
   action,
   children,
}: DashboardSectionCardProps) {
   return (
      <div className="bg-bgCard border border-borderCard rounded-lg overflow-hidden flex flex-col h-full">
         <div className="flex items-center justify-between p-6">
            <div>
               <h2 className="text-white text-lg font-semibold">
                  {title}
               </h2>

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