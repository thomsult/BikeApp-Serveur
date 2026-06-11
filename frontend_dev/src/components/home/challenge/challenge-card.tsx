import { useTranslation } from "react-i18next";
import type { Challenge } from "../../../lib/api/challenge/challenge";
import { Clock, ClockIcon, PlusIcon, Ruler, RulerIcon, TimerIcon } from "lucide-react";
import { Card, CardAction, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LabelBadge from "@/components/ui/label-badge";
import { Progress } from "@/components/ui/progress";

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
}
const ChallengeCard = ({ challenge, onPress }: ChallengeCardProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "common.challenge",
  });

  const ChallengeIcon =
    challenge.challengeType === "distance"
      ? RulerIcon
      : challenge.challengeType === "time"
        ? ClockIcon
        : TimerIcon;
  challenge.progress = 10
  return (
    <button
      onClick={onPress}
      className="w-full text-left min-w-[450px] h-[210px]"
    >
      <Card className="relative gap-3 flex h-full w-full overflow-hidden rounded-2xl border border-white/5 bg-card p-5">

        {/* Icône décorative en arrière-plan */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.06]">
          <ChallengeIcon size={180} className="text-primary" />
        </div>

        {/* Header : type + durée restante */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <ChallengeIcon size={11} />
            {t(`challenge_types.${challenge.challengeType}`)}
          </span>

          {challenge.durationChallenge !== 0 && challenge.durationChallenge && (
            <LabelBadge
              size="small"
              type="info"
              text={t(
                challenge.durationChallenge > 1
                  ? "days_left_plural"
                  : "days_left",
                { count: challenge.durationChallenge },
              )}
            />
          )}
        </div>

        {/* Titre */}
        <div className=" flex-1">
          <p className="text-3xl font-black leading-tight tracking-tight">
            {challenge.title}
          </p>
          {challenge.description ? (
            <p className="text-xs mt-2 text-muted-foreground">
              {challenge.description}
            </p>
          ) : <p className="text-xs mt-2 text-muted-foreground italic">
            {" "}
          </p>}
        </div>

        {/* Description */}

        {/* Barre de progression */}
        {challenge.progress && challenge.progress > 0 ? (
          <div className="space-y-1 pb-2 ">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t("progress")}
              </span>
              <span className="text-xl mb-1 font-black tabular-nums leading-none">
                {challenge.progress}%
              </span>
            </div>
            <Progress
              value={challenge.progress}
              className="h-1.5 bg-gray-100 [&>div]:transition-all [&>div]:duration-700"
            />
          </div>
        ) : null}
      </Card>
    </button>
  );
};
const CreateChallengeCard = ({ onPress }: { onPress: () => void }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.challenge",
  });
  return (
    <button
      onClick={onPress}
      className="mr-3 min-w-[450px] h-[210px]  cursor-pointer  border-collapse rounded-xl border-2 border-dashed border-gray-400 bg-transparent p-4 dark:border-gray-600"
    >
      <div className="h-full flex-1 flex items-center justify-center">
        <PlusIcon size={43} className="text-primary" />
        <span
          className="mt-2 text-sm font-bold text-primary"
        >
          {t("empty_action")}
        </span>
      </div>
    </button>
  );
};

const EmptyState = ({ onPress }: { onPress: () => void }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.challenge",
  });

  return (
    <Card
      onClick={onPress}
      className="flex min-h-[200px] cursor-pointer flex-col items-center gap-1.5 rounded-xl  p-8 transition-colors hover:border-border/80"
    >
      <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-primary/10 border-primary/20">
        <PlusIcon size={20} className="text-primary" />
      </div>

      <CardTitle className="text-center text-[15px] font-medium">
        {t("empty")}
      </CardTitle>

      <CardDescription className="max-w-[220px] text-center text-[13px] leading-relaxed">
        {t("empty_description")}
      </CardDescription>

      <CardAction className="mt-4 flex w-full items-center justify-center ">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer gap-1.5 text-[13px] font-medium w-2/3 text-primary hover:bg-primary/10 hover:text-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <PlusIcon size={14} className="text-primary" />
          {t("empty_action")}
        </Button>
      </CardAction>
    </Card>
  );
};

export { ChallengeCard, CreateChallengeCard, EmptyState };
