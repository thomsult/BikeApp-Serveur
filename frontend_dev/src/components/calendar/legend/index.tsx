import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import type { TypeActivity } from "@/lib/api/type-activity/type-activity";
// import useHandleDeepLink from "@/lib/hooks/use-handle-deep-link";
import { TagIcon, PencilIcon } from "lucide-react";
// import { ActivityTypesModals } from "../activities-types-modals";
import { AddCardLegend } from "./legend-card";
import { ActivityTypesModals } from "./activities-types-modals";
import useHandleDeepLink from "@/lib/hooks/use-handle-deep-link";

export const Legend = () => {
  const { t } = useTranslation();
  const { data: typeActivities } = useAllTypeActivities();

  const [modalVisible, setModalVisible] = useState<
    (TypeActivity & { refer?: string }) | null
  >(null);

  const { navigate, resetNavigate } = useHandleDeepLink<
    TypeActivity & { refer?: string }
  >({
    originalPath: "/calendar",
    path: "activity-type-modal",
    show: (newActivity) => {
      if (newActivity["activity-type-modal"] === "new") {
        delete newActivity["activity-type-modal"];
        setModalVisible({ ...newActivity, _isInvoked: true });
      } else {
        setModalVisible(
          typeActivities?.find(
            (activity) => activity.id === newActivity["activity-type-modal"],
          ) ?? null,
        );
      }
    },
    hide: () => setModalVisible(null),
  });

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <TagIcon size={20} className="text-foreground" />
            <span className="text-base font-bold">
              {t("components.legend.title")}
            </span>
          </div>
          <span className="rounded-full bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
            {typeActivities?.length || 0}
          </span>
        </div>

        {/* Contenu */}
        <div className="px-5 py-4">
          {/* Liste des types d'activités */}
          <div className="flex flex-col gap-2">
            {typeActivities?.map((typeActivity: TypeActivity, index) => (
              <button
                key={typeActivity.id || index}
                onClick={() => navigate(typeActivity)}
                className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-muted/50"
              >
                {/* Indicateur de couleur */}
                <span
                  className="size-3 shrink-0 rounded-full shadow-sm"
                  style={{
                    backgroundColor: typeActivity.color,
                    boxShadow: `0 0 4px ${typeActivity.color}80`,
                  }}
                />

                {/* Label */}
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">
                    {t(`common.activity-type.label.${typeActivity.label}`, {
                      defaultValue: typeActivity.label,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    {t(`common.activity-type.family.${typeActivity.family}`, {
                      defaultValue: typeActivity.family,
                    })}
                  </p>
                </div>

                {/* Bouton éditer */}
                <PencilIcon size={16} className="shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Bouton ajouter */}
          <AddCardLegend
            title={t("components.legend.addButton")}
            onPress={() => navigate({ id: "new" } as TypeActivity)}
          />
        </div>
      </div>

      {/* Modal */}
      <ActivityTypesModals
        hideModal={(refer) => resetNavigate(refer)}
        showModal={modalVisible}
      />
    </>
  );
};