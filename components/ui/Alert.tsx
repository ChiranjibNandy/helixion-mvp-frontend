import { cn } from '@/lib/utils';

const alertVariants: Record<string, string> = {
  default: 'bg-muted text-foreground border-border',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 flex items-start gap-3 text-sm',
        alertVariants[variant],
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-relaxed', className)} {...props} />
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn('font-semibold leading-none tracking-tight mb-1', className)} {...props} />
  );
}

export { Alert, AlertDescription, AlertTitle };