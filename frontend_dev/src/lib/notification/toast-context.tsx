//--------------------------------------------------------------------------//
//                               TOAST SERVICE                              //
//--------------------------------------------------------------------------//
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { toast as sonnerToast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  id: number | string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  progress?: boolean;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  message?: string;
  duration?: number;
  progress?: boolean;
}

// ─── Variant config ───────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, { color: string; defaultTitle: string; progress?: boolean }> = {
  success: { color: "bg-green-500", defaultTitle: "Success", progress: true },
  error: { color: "bg-red-500", defaultTitle: "Error", progress: false },
  info: { color: "bg-blue-500", defaultTitle: "Info", progress: true },
};

// ─── Component ────────────────────────────────────────────────────────────

function ToastComponent({ id, title, description, variant = "info", progress, duration = 2000 }: ToastProps) {
  const [progressValue, setProgressValue] = useState(100);

  useEffect(() => {
    if (!progress) return;

    const interval = 10; // ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgressValue((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [progress, duration]);

  return (
    <Alert variant={variant == "error" ? "destructive" : "default"} className="w-[90vw] lg:max-w-md relative overflow-hidden">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
      <AlertAction>
        <Button onClick={() => sonnerToast.dismiss(id)} size="icon-xs" variant="ghost">
          <Cross2Icon className="h-4 w-4" />
        </Button>
      </AlertAction>
      {progress && (<div className={`absolute  bottom-0 w-full h-fit   rounded-lg pointer-events-none`}>
        <Progress value={progressValue} className="w-full" />
      </div>)}
    </Alert>
  );
}

// ─── Core ─────────────────────────────────────────────────────────────────

function showToast(
  variant: ToastVariant,
  { title = VARIANT_CONFIG[variant].defaultTitle, message = "", duration = 2000, progress = VARIANT_CONFIG[variant].progress }: ToastOptions
) {


  return sonnerToast.custom((id) => (
    <ToastComponent
      id={id}
      title={title}
      description={message}
      variant={variant}
      progress={progress}
      duration={duration}
    />
  ), { duration: duration + 500 }); // Add extra time to ensure progress bar completes
}

// ─── Public API ───────────────────────────────────────────────────────────

export const Toast = {
  success: (options: ToastOptions) => showToast("success", options),
  error: (options: ToastOptions) => showToast("error", options),
  info: (options: ToastOptions) => showToast("info", options),
};