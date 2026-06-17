import type { Challenge } from "@/lib/api/challenge/challenge";
import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { useTranslation } from "react-i18next";
import { useForm, useStore } from "@tanstack/react-form";
import { useCreateChallenge, useDeleteChallenge, useUpdateChallenge } from "@/lib/api/challenge";
import { FormField } from "../../ui/form-field";
import { ControlledInput } from "../../ui/input";
import { ControlledTextarea } from "../../ui/textarea";
import { ControlledSelectInput } from "../../ui/select-input";
import { alertsConfirmation } from "@/components/alerts";
import type { ChallengeResource } from "@/client";

export const ChallengeModal = ({
  showModal,
  hideModal,
}: {
  showModal: ChallengeResource | null;
  hideModal: () => void;
}) => {
  const { t } = useTranslation();
  const prefix = "app.home.challenges.modal";

  const { mutateAsync: deleteChallenge } = useDeleteChallenge();
  const { mutateAsync: createChallenge } = useCreateChallenge();
  const { mutateAsync: updateChallenge } = useUpdateChallenge();
  const { Field, store, handleSubmit, reset } = useForm({
    defaultValues: showModal?.id
      ? showModal
      : ({
        title: "",
        description: "",
        durationChallenge: 7,
        challengeType: "distance",
        challengeValue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
      } as ChallengeResource),
    onSubmit: async ({ value }) => {
      let formValue: ChallengeResource = {} as ChallengeResource;
      if (value.id && value.id !== "new" && !isSuggestion) {
        if (value.progress !== undefined) {
          const confirme = await alertsConfirmation({
            title: t("app.home.challenges.modal.update_progress_title"),
            message: t("app.home.challenges.modal.update_progress_confirmation"),
            button: {
              confirm: t("common.actions.confirm"),
              cancel: t("common.actions.cancel"),
            },
          });
          if (!confirme) {
            return; // Ne pas continuer le processus de mise à jour si l'utilisateur annule
          }
          else {
            value.progress = 0; // Réinitialiser la progression à 0
          }
        }
        formValue = await updateChallenge({
          ...value,
          updatedAt: new Date().toISOString(), // Met à jour la date de modification
        });
      } else {
        formValue = await createChallenge(value);
      }
      // Après la création ou la mise à jour, fermer le modal et réinitialiser le formulaire
      if (await handleClose()) {
        reset();
        hideModal();
      }
    },
  });

  const formState = useStore(store, (state) => state.values);
  const isDirty = useStore(store, (state) => state.isDirty);
  const isDailyGoal = formState?.isDailyGoal || false;
  const isSuggestion = formState?.isSuggestion || false;

  const {
    handleCancel,
    handleClose,
    handleDelete,
  } = useModalLayout();

  const typeChallengeOptions = [
    {
      label: t("common.challenge.challenge_types.distance"),
      value: "distance",
    },
    { label: t("common.challenge.challenge_types.time"), value: "time" },
    { label: t("common.challenge.challenge_types.speed"), value: "speed" },
  ];

  const handleDeleteChallenge = async () => {
    const confirmed = await handleDelete();
    if (confirmed && formState.id) {
      try {
        await deleteChallenge(formState);
      } catch (error) {
        console.error("Error deleting challenge:", error);
      } finally {
        if (await handleClose()) {
          reset();
          hideModal();
        }
      }
    }
  };

  return showModal && (<>

    <ModalLayout
      title={isDailyGoal ? t("components.day_progress.title") : !isSuggestion ? !showModal?.title
        ? t(`${prefix}.create_title`)
        : t(`${prefix}.edit_title`, { title: showModal.title }) : showModal?.title}
      description={showModal?.description}
      hideModal={isDirty ? handleCancel : handleClose}
      showModal={!!showModal}
      footer={{
        handleSubmit,
        isDirty,
        handleDelete: !isDailyGoal && !isSuggestion && (showModal?.id && showModal.id !== "new") ? handleDeleteChallenge : undefined,
      }}
      onModalUnmount={() => {
        reset();
        setTimeout(() => {
          hideModal();
        }, 0);
      }}
    >
      <div className="flex  w-full flex-col gap-4 px-4 overflow-auto pb-20 ">
        <FormField label={t(`${prefix}.field.name_label`)}>
          {!isDailyGoal && !isSuggestion ? (
            <ControlledInput
              id="title"
              Field={Field}
              type="text"
              placeholder={t(`${prefix}.field.name_placeholder`)}
              defaultValue={formState.title}
              required
            />
          ) : (
            <div className="flex  w-full flex-row justify-between  rounded-md border border-input  bg-input/30  px-3 py-2  text-base ">
              <p >
                {isSuggestion
                  ? showModal?.title
                  : t("components.day_progress.title")}
              </p>
            </div>
          )}
        </FormField>
        <FormField label={t(`${prefix}.field.description_label`)}>
          {!isDailyGoal && !isSuggestion ? (
            <ControlledTextarea
              id="description"
              Field={Field}
              placeholder={t(`${prefix}.field.description_placeholder`)}
              defaultValue={formState.description}
              numberOfLines={4}

            />
          ) : (
            <div className="h-50 flex flex-row justify-between  rounded-md border border-input  bg-input/30  px-3 py-2  text-base ">
              <p >
                {isSuggestion
                  ? showModal?.description
                  : t("components.day_progress.description")}
              </p>
            </div>
          )}
        </FormField>
        <FormField label={t(`${prefix}.field.type_label`)}>
          <ControlledSelectInput
            disabled={isSuggestion}
            id="challengeType"
            Field={Field}
            options={typeChallengeOptions}
            placeholder={t(`${prefix}.field.type_placeholder`)}
            defaultValue={formState.challengeType}
          />
        </FormField>
        <FormField label={t(`${prefix}.field.challenge_value_label`)}>
          {!isSuggestion ? (
            <ControlledInput
              id="challengeValue"
              Field={Field}
              type="number"
              placeholder={t(`${prefix}.field.challenge_value_placeholder`)}
              defaultValue={formState.challengeValue}
              suffix={
                formState.challengeType == 'distance' ? "m" :
                  formState.challengeType == 'speed' ? "km/h" :
                    "min"
              }

            />
          ) : (
            <div className="flex  w-full flex-row justify-between  rounded-md border border-input  bg-input/30  px-3 py-2  text-base ">
              <p >
                {formState.challengeValue}{" "}
                {formState.challengeType == 'distance' ? "m" :
                  formState.challengeType == 'speed' ? "km/h" :
                    "min"}
              </p>
            </div>
          )}
        </FormField>
        <div>
          {formState.challengeType === "distance" ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t(`${prefix}.field.distance_description`)}
            </p>
          ) : formState.challengeType === "time" ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t(`${prefix}.field.time_description`)}
            </p>
          ) : formState.challengeType === "speed" ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t(`${prefix}.field.speed_description`)}
            </p>
          ) : null}
        </div>
        <FormField label={t(`${prefix}.field.total_duration_label`)}>
          {!isDailyGoal && !isSuggestion ? (<>
            <ControlledInput
              id="durationChallenge"
              Field={Field}
              type="number"
              placeholder={t(`${prefix}.field.total_duration_placeholder`)}
              defaultValue={formState.durationChallenge}
              suffix="jours"

            />
          </>) : (
            <div className="flex  w-full flex-row justify-between  rounded-md border border-input  bg-input/30  px-3 py-2  text-base ">
              <p >
                {formState.durationChallenge}{" "}
                {t("common.units.days_long", {
                  count: formState.durationChallenge || 0,
                })}
              </p>
            </div>
          )}
        </FormField>
        <div>
          {!isDailyGoal ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t(`${prefix}.field.total_duration_description`)}
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("components.day_progress.daily_goal_duration_description")}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("components.day_progress.daily_goal_reset_description")}
              </p>
            </>
          )}
        </div>
        {formState.progress && <div className="mt-4 flex-row items-center justify-between">
          <p className="text-base font-medium" >
            {t("common.challenge.progress")}
          </p>
          <p className="mt-2 text-sm" >
            {Number(formState.progress || 0)} / {Number(formState.challengeValue || 0)}
          </p>
        </div>}
      </div >
    </ModalLayout >
  </>
  );
}
