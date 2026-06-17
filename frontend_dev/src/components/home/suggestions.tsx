import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAllSuggestions, useDeleteSuggestion, useUpdateSuggestion } from "@/lib/api/suggestions";
import type { AllSuggestions } from "@/lib/api/suggestions/suggestion";
import TitlesSection from "../ui/titles-section";
import SuggestionCard from "./suggestions/suggestion-card";
import type { NotificationResource } from "@/client";

const Suggestions = () => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const { data: suggestions = [] } = useAllSuggestions();
  const { mutateAsync: deleteSuggestion } = useDeleteSuggestion();
  const { mutateAsync: updateSuggestion } = useUpdateSuggestion();

  const [localSuggestions, setLocalSuggestions] = useState(suggestions);

  useEffect(() => {
    setLocalSuggestions(suggestions.filter((s) => s.title)); // Filtrer les suggestions sans titre
  }, []);

  const handleDelete = useCallback((suggestion: NotificationResource) => {
    setLocalSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    deleteSuggestion({
      ...suggestion,
      option: { toast: false },
    }).catch((error) => {
      console.error("Erreur lors de la suppression de la suggestion :", error);
    });
  }, [deleteSuggestion]);

  const handleRead = useCallback((item: NotificationResource) => updateSuggestion({
    ...item,
    readAt: new Date().toISOString(),
    option: { toast: false },
  }), [updateSuggestion]);

  const sortedSuggestions = [...localSuggestions].sort((a, b) => {
    const aIsUnread = !a.readAt;
    const bIsUnread = !b.readAt;
    if (aIsUnread && !bIsUnread) return -1;
    if (!aIsUnread && bIsUnread) return 1;
    return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
  });

  const displayedSuggestions = showAll
    ? sortedSuggestions
    : sortedSuggestions.slice(0, 3);

  if (!localSuggestions.length) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <TitlesSection title={t("components.suggestions.for_you")} />

        {localSuggestions.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-semibold text-primary transition-opacity hover:opacity-70"
          >
            {showAll ? t("common.showLess") : t("common.showMore")}
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-2">
        {displayedSuggestions.map((item) => (
          <div
            key={item.id}
            className="transition-all duration-300 ease-in-out"
          >
            <SuggestionCard
              suggestion={item}
              onDelete={handleDelete}
              onRead={() => handleRead(item)}
            />
          </div>
        ))}
      </div>

      {/* Voir plus (footer) */}
      {!showAll && localSuggestions.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 w-full text-center text-sm text-muted-foreground transition-opacity hover:opacity-70"
        >
          {t("common.andMore", {
            count: localSuggestions.length - 3,
            item: t("components.suggestions.title"),
          })}
        </button>
      )}
    </div>
  );
};

export default Suggestions;