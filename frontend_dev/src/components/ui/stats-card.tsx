import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

export interface StatsCardProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  value: number | string;
  unit?: string;
  label: string;
  isWarning?: boolean;
  isEmpty?: boolean;
  onPress?: () => void;
  size?: "small" | "large" | string;
  layout?: "grid" | "list";
}

export const StatsCard = ({
  Icon,
  value,
  unit,
  label,
  isWarning = false,
  isEmpty = false,
  onPress,
  size = "large",
}: StatsCardProps) => {
  const { t } = useTranslation();

  const CardWrapper = onPress ? "button" : "div";

  const numericValue = Number(value);
  const displayValue = Number.isNaN(numericValue)
    ? value
    : numericValue > 99
      ? "100"
      : (() => {
        const fixed = numericValue.toFixed(1);
        return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed.slice(0, 4);
      })() || 0;

  return (
    <CardWrapper
      onClick={onPress}
      className={cn(
        "relative flex-1 overflow-hidden rounded-2xl bg-card",
        isWarning ? "border-2 border-destructive" : "border border-border",
        onPress && "transition-opacity active:opacity-80")}
      style={{ minWidth: "30%" }}
    >
      {/* Background icon */}
      <div
        className={cn(
          "pointer-events-none absolute -bottom-6 -right-6",
          isEmpty ? "opacity-5" : "opacity-[0.08]",
        )}
        aria-hidden="true"
      >
        <Icon
          size={100}
          className={isWarning ? "text-destructive" : "text-primary"}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ minHeight: 112 }}
      >
        {/* Warning badge */}
        {isWarning && (
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <ExclamationTriangleIcon
              width={12}
              height={12}
              className="text-destructive"
            />
            <p className="text-xs font-semibold text-destructive">
              {t("common.urgent")}
            </p>
          </div>
        )}

        {/* Value */}
        <div className="flex flex-1 items-center justify-center pt-6">
          {isEmpty ? (
            <div className="-translate-y-2 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Icon size={34} className="text-primary" />
            </div>
          ) : (
            <p
              className={cn(
                "text-center font-bold",
                isWarning ? "text-destructive" : "text-foreground",
                size === "large" ? "text-5xl" : "text-3xl",
              )}
            >
              {displayValue}
              {unit ? ` ${unit}` : ""}
            </p>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-col items-center px-3 pb-3">
          <p className="text-center text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </p>

          {isEmpty ? (
            <p className="text-center text-xs font-medium italic tracking-tighter text-muted-foreground/70">
              {t("common.stats.no_stats")}
            </p>
          ) : Number.isFinite(numericValue) && numericValue > 99 ? (
            <p className="text-center text-xs font-medium italic tracking-tighter text-muted-foreground/70">
              {t("common.stats.hundred_or_more")}
            </p>
          ) : null}
        </div>
      </div>
    </CardWrapper>
  );
};