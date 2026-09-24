import Link from 'next/link';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface QuickActionCardProps {
    title: string;
    description: string;
    linkText: string;
    href: string;
    icon?: ReactNode;
    iconBg?: string;
}

export function QuickActionCard({
    title,
    description,
    linkText,
    href,
    icon,
    iconBg = 'bg-primary/10',
}: QuickActionCardProps) {
    return (
        <Link href={href} className="block h-full">
            <Card className="bg-bgStatCard border-borderCard py-0 gap-0 p-4 flex flex-col justify-between h-full hover:border-primary/50 transition-colors cursor-pointer">
                <div>
                    {icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
                            {icon}
                        </div>
                    )}
                    <h3 className="text-white text-base font-semibold mb-1">{title}</h3>
                    <p className="text-textSecondary text-sm leading-relaxed mb-3">
                        {description}
                    </p>
                </div>
                <span className="text-primary hover:text-white text-sm font-medium transition-colors">
                    {linkText} →
                </span>
            </Card>
        </Link>
    );
}
