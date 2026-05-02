import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/Alert";

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
        variant === "success" &&
          "border-green-500 text-green-600",
        className
      )}
    >
      <Icon className="size-4" />

      {title && <AlertTitle>{title}</AlertTitle>}

      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}