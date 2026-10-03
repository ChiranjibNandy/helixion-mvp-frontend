import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type AppAlertProps = {
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success" | "warning";
  className?: string;
};

export function AppAlert({
  title,
  description,
  variant = "default",
  className,
}: AppAlertProps) {
  const Icon =
    variant === "destructive"
      ? AlertCircle
      : variant === "success"
      ? CheckCircle2
      : Info;

  return (
    <Alert
      variant={variant === "destructive" ? "destructive" : "default"}
      className={cn(
        "flex flex-col",
        variant === "success" &&
        "border-green-500 text-green-600",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4" />

        {title && <AlertTitle>{title}</AlertTitle>}
      </div>

      <AlertDescription>{description}</AlertDescription>
    </Alert>

  );
}