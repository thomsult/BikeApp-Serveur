import { useState } from "react";
import type { AllSuggestions } from "@/lib/api/suggestions/suggestion";
import {
  TrophyIcon,
  WrenchIcon,
  SunIcon,
  UsersIcon,
  MapIcon,
  BikeIcon,
  HandMetalIcon,
  HelpCircleIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { alertsConfirmation } from "@/components/alerts";

const SUGGESTION_ICONS = {
  challenge: TrophyIcon,
  maintenance: WrenchIcon,
  weather: SunIcon,
  social: UsersIcon,
  route: MapIcon,
  equipment: BikeIcon,
  welcome: HandMetalIcon,
} as const;

const SuggestionIcon = ({ type }: { type: string }) => {
  const Icon = SUGGESTION_ICONS[type as keyof typeof SUGGESTION_ICONS] ?? HelpCircleIcon;
  return <Icon size={120} />;
};

const MarkdownText = ({ content }: { content: string }) => {
  if (!content) return null;
  const htmlContent = content
    .replace(/\\n/g, "\n") // ← IMPORTANT
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(?!\*)(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^\s*-\s*/gm, "<br style=\"margin-bottom: 0.5em;\" />- ")
    .replace(/\n/g, "<br />");


  return (
    <div
      className="flex flex-col gap-2"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

const SuggestionCard = ({
  suggestion,
  onDelete,
  onRead,
}: {
  suggestion: AllSuggestions;
  onDelete: (suggestion: AllSuggestions) => void;
  onRead: () => void;
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (!suggestion.readAt) onRead();
    if (suggestion.link) window.open(suggestion.link as string, "_blank", "noopener,noreferrer");
  };
  const confirmDelete = () => alertsConfirmation({ message: t("common.alerts.deleteConfirmation"), title: t("common.alerts.deleteConfirmationTitle"), button: { confirm: t("common.actions.confirm"), cancel: t("common.actions.cancel") } });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (await confirmDelete()) {
      onDelete(suggestion);
    }
  };


  return (
    <div className="group relative mb-4">
      <Card
        onClick={handleClick}
        className={`
          relative flex cursor-pointer flex-row items-center gap-3 overflow-hidden rounded-xl border p-4
          transition-all duration-200 hover:shadow-md
          ${suggestion.readAt ? "border-border" : "border-primary/50"}
        `}
      >
        {/* Icône décorative en arrière-plan */}
        <div className="pointer-events-none absolute -bottom-10 -right-5 opacity-[0.05] text-primary">
          <SuggestionIcon type={suggestion.suggestionType || ""} />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex-1">
          <p className="mb-1 truncate text-base font-semibold leading-tight">
            {suggestion.title}
          </p>
          <div className="max-w-[80%] text-sm text-muted-foreground">
            <MarkdownText content={suggestion.subtitle} />
          </div>
        </div>

        {/* Chevron si lien */}
        {suggestion.link && (
          <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ChevronRightIcon size={14} className="text-primary" />
          </div>
        )}
      </Card>

      {/* Bouton supprimer (visible au hover) */}
      <Button
        variant={"destructive"}
        onClick={handleDelete}
        className={`
          absolute right-2 top-2 z-20 flex size-7 items-center justify-center rounded-full
          transition-all duration-200 hover:bg-destructive text-white opacity-100 cursor-pointer
          
          
        `}
        title={t("common.actions.delete")}
      >
        <Trash2Icon size={13} />
      </Button>
    </div>
  );
};

export default SuggestionCard;