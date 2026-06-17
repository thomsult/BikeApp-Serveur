import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Clock, RulerDimensionLine, SoapDispenserDroplet } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import type { ChallengeResource } from "@/client";


const getAccentColor = (pct: number) => {
  if (pct >= 100) return { bg: "bg-emerald-500", text: "text-emerald-500", glow: "shadow-emerald-500/20" };
  if (pct >= 50) return { bg: "bg-amber-400", text: "text-amber-400", glow: "shadow-amber-400/20" };
  return { bg: "bg-rose-500", text: "text-rose-500", glow: "shadow-rose-500/20" };
};

const ChallengeIcon = ({ type, size }: { type?: string; size: number }) => {
  if (type === "distance") return <RulerDimensionLine size={size} />;
  if (type === "time") return <Clock size={size} />;
  return <SoapDispenserDroplet size={size} />;
};

const DailyGoal: React.FC<{ dailyGoal: ChallengeResource }> = ({ dailyGoal }) => {
  const { t } = useTranslation();
  const progress = Number(dailyGoal?.progress) || 0;

  const accent = getAccentColor(progress);

  const isCompleted = progress >= 100;
  const hasGoal = !!progress;

  const unit =
    dailyGoal?.challengeType === "distance" ? "km" :
      dailyGoal?.challengeType === "time" ? "min" : "km/h";

  const progressValue = dailyGoal?.challengeValue
    ? `${(dailyGoal.challengeValue / 100) * progress}`
    : null;

  const dailyGoalDisplay = progressValue
    ? `${progressValue} ${unit}`
    : dailyGoal
      ? t("components.day_progress.no_goal_value")
      : t("components.day_progress.no_goal");

  return (
    <>
      <Link
        to="/"
        search={{ "challenge-modal": dailyGoal ? dailyGoal.id : "new" }}
      >
        <Card className={`
          relative overflow-hidden rounded-2xl p-5
          
          border border-white/5
          bg-card
          shadow-xl 
          transition-all duration-300
          hover:scale-[1.01] hover:shadow-2xl
          active:scale-[0.99]
        `}>

          {/* Icône décorative en arrière-plan */}
          <div className="absolute -bottom-4 -right-4 opacity-[0.06] pointer-events-none">
            <ChallengeIcon type={dailyGoal?.challengeType} size={130} />
          </div>

          {/* Header : type de challenge + pourcentage */}
          <div className="flex items-center justify-between mb-4">
            <span className={`
              inline-flex items-center gap-1.5
              text-[11px] font-semibold uppercase tracking-widest
              px-2.5 py-1 rounded-full
              bg-white/5 border border-white/10
              text-muted-foreground
            `}>
              <ChallengeIcon type={dailyGoal?.challengeType} size={11} />
              {t(`common.challenge.challenge_types.${dailyGoal?.challengeType}`)}
            </span>

            {hasGoal && (
              <span className={`
                text-2xl font-black tabular-nums leading-none
                ${accent.text}
              `}>
                {progress}%
              </span>
            )}
          </div>

          {/* Contenu principal */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">
              {isCompleted
                ? t("components.day_progress.title_completed")
                : t("components.day_progress.title")}
            </p>
            <p className="text-3xl font-black leading-tight tracking-tight">
              {isCompleted
                ? t("components.day_progress.greeting")
                : dailyGoalDisplay}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-4">
            {isCompleted
              ? t("components.day_progress.description_completed")
              : t("components.day_progress.description")}
          </p>

          {/* Barre de progression */}
          {hasGoal && (
            <div className="space-y-1.5">
              <Progress
                value={progress}
                className={`h-1.5 bg-white/10 [&>div]:${accent.bg} [&>div]:transition-all [&>div]:duration-700`}
              />
            </div>
          )}
        </Card>
      </Link >
    </>
  );
};

export default DailyGoal;