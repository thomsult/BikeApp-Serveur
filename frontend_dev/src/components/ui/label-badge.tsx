import { cn } from "@/lib/utils";

const LabelBadge = ({
  text,
  size = "large",
  type = "success",
  className,
}: {
  text: string;
  size?: "small" | "large" | "extraSmall";
  type?: "success" | "error" | "warning" | "info" | "muted" | "outlined";
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap items-center rounded-full",
        {
          "bg-green-500/50  ": type === "success",
          "bg-red-500/40  ": type === "error",
          "bg-yellow-500/50  ": type === "warning",
          "bg-blue-500/50  ": type === "info",
          "bg-muted/60  text-muted-foreground": type === "muted",
          "border border-white/25 capitalize mix-blend-difference": type === "outlined",
        },
        {
          "px-2 py-0": size === "extraSmall",
          "px-3.5 py-0.5": size === "small",
          "px-5 py-1.5": size === "large",
        },
        " dark:opacity-50",

        className,
      )}
    >
      <span className={
        cn(
          "leading-tight text-white",
          {
            "text-muted-foreground": type === "muted",
            "text-white mix-blend-difference": type === "outlined",
          },
          {
            "text-[10px] font-normal": size === "extraSmall",
            "text-xs font-medium": size === "small",
            "text-xl font-semibold": size === "large",
          },
        )
      }>
        {text}
      </span>
    </span >
  );
};

export default LabelBadge;