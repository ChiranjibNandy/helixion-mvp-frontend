
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageBreadcrumbProps {
  label: string;
  href: string;
  className?: string;
}

export function PageBreadcrumb({
  label,
  href,
  className = "",
}: PageBreadcrumbProps) {
  return (
    <Link
      href={href}
      className={`inline-flex w-fit items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-600 ${className}`}
    >
      <ChevronLeft size={16} />
      <span>{label}</span>
    </Link>
  );
}
