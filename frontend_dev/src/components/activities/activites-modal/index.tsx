import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput } from "@/components/ui/input";
import LabelBadge from "@/components/ui/label-badge";
import { ControlledSelectInput } from "@/components/ui/select-input";
import { ControlledTextarea } from "@/components/ui/textarea";
import type { AnyActivityT } from "@/lib/api/activity/activity";
import { useAllTypeActivities, useCreateTypeActivity } from "@/lib/api/type-activity";
import { Toast } from "@/lib/notification/toast-context";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RecurrenceActivity } from "./recurrence-activity";
import { PlusIcon } from "lucide-react";
import { format, isPast } from "date-fns";
import { ActivityByType } from "./activity-selector";
import type { TypeActivity, TypeActivityFamily } from "@/lib/api/type-activity/type-activity";
import { useValidationSchema } from "./activity-validator";
import { useCreateActivity, useDeleteActivity, useUpdateActivity } from "@/lib/api/activity";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";
import { useHandleNewActivity } from "../use-handle-new-activity";
import { useHandleNewRides } from "../use-handle-new-rides";
import type { ID } from "@/lib/api/types";


export type FieldType = React.ComponentType<{
  name: string;
  children?: (props: AnyFieldApi) => React.ReactNode;
}> & React.ComponentPropsWithoutRef<"input">;


interface ActivityModalsProps {
  showModal: (AnyActivityT & { refer?: string }) | null;
  hideModal: (refer?: string) => void;
}
export const ActivitiesModal = ({
  showModal,
  hideModal,
}: ActivityModalsProps) => {
  const { t } = useTranslation();
  const [isChanged, setIsChanged] = useState(false);
  const { data: typeActivities } = useAllTypeActivities();
  const { mutateAsync: createActivity } = useCreateActivity();
  const { mutateAsync: updateActivity } = useUpdateActivity();
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const limitDate = useMemo(() => {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 1);
    return limitDate;
  }, []);

  const activitiesModalValidator = useValidationSchema({ limitDate, typeActivities });
  const handleSubmitFormWithoutRedirect = async (value: AnyActivityT) => {
    try {
      const typeFamily = typeActivities?.find(
        (type) => String(type.id) === String(value.type)
      )?.family;

      const payload = {
        ...value,
        typeFamily: typeFamily as TypeActivityFamily,
      };

      const result = value.id
        ? await updateActivity({
          ...payload,
          updatedAt: new Date().toISOString(),
        })
        : await createActivity({
          ...payload,
          createdAt: new Date().toISOString(),
        });

      reset(value, { keepDefaultValues: true });
      return result;
    }
    catch (error) {
      console.error("Error submitting form:", error);
      return undefined; // ou throw error;
    }
  };

  const handleSubmitForm = async (value: AnyActivityT) => {
    const result = await handleSubmitFormWithoutRedirect(value);
    if (result) {
      hideModal();
      return result;
    }
  };
  const defaultValues: Partial<AnyActivityT> = {
    title: "",
    description: "",
    type: undefined,
    dt_start: "",
    dt_end: "",
    notes: "",
    recurrence: {
      frequency: "none",
      interval: 0,
    },
  };
  const initialValues = useMemo(() => {
    if (!showModal) return defaultValues;

    return {
      ...defaultValues,
      ...showModal,
      type: showModal.type,
      bike: showModal.bike ? { id: showModal.bike.id } : undefined,
      component: showModal.component ? { id: showModal.component.id } : undefined,
      typeFamily: (showModal.type
        ? typeActivities?.find((type) => type.id === showModal.type.id)?.family
        : "other") || "other",
    };
  }, [showModal, typeActivities]);

  useEffect(() => {
    // reset changed flag when modal content changes
    setIsChanged(false);
  }, [showModal]);

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => handleSubmitForm(value as AnyActivityT),
    onSubmitInvalid: (e) => {
      console.warn("Form submission failed with values:", formState);
      console.warn("Invalid form submission", form.getAllErrors());
      Toast.error({
        title: t("common.errors.validationError", {
          message: "",
        }),
        message: t("common.errors.correctFormErrors"),
      });
    },
    validators: {
      onChange: activitiesModalValidator,
    }
  });


  const formKey = showModal ? `edit-${showModal.id}` : "create";
  const { Field, reset, handleSubmit } = form;
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const formState = useStore(form.store, (state) => state.values);
  const title = useMemo(() => {
    return formState.createdAt && formState.id
      ? t("components.activities.editActivity")
      : t("components.activities.newActivity");
  }, [formState, limitDate, t]);


  const description = useMemo(() => {
    //TODO REVOIR CETTE PARTIE
    return <span className="flex justify-between">
      {t("components.activities.rideDetails")}
      {formState.completedAt && <LabelBadge
        type="info"
        text={t("components.activities.completed")}
        size="extraSmall"
      />}

    </span>;
  }, [formState, limitDate, t]);

  const isReadOnly = formState.createdAt !== undefined && !(isPast(new Date(formState.createdAt)) && !formState.completedAt);
  const handleClickNewType = useCallback(() => { }, []);

  const selectOptions = useMemo(() => {
    return (typeActivities?.map((activity) => ({
      label: activity.label,
      value: String(activity.id),
      id: activity.id,
    })) as { label: string; value: string; id: ID | undefined }[]) || [];
  }, [typeActivities]);

  const selectSuffix = useCallback((e: any) => {
    const type = typeActivities?.find((type) => type.id == e);
    return type ? t("common.activity-type.family." + (type ? type.family : "")) : "";
  }, [typeActivities, t]);

  const selectExtraChildren = useCallback(() => {
    return (
      <button
        onClick={handleClickNewType}
        className="w-full cursor-pointer flex flex-row items-center justify-center gap-2 rounded-lg border border-dashed  p-3"
      >
        <PlusIcon className="size-4" />
        <span className="text-sm">{t("common.activity-type.add_type")}</span>
      </button>
    );
  }, [handleClickNewType, t]);
  const { handleNewRide } = useHandleNewRides();
  const handleClickNewRideItinerary = useCallback(async () => {
    const formdata = form.store.state.values
    const result = await handleSubmitFormWithoutRedirect(formdata as AnyActivityT);
    if (result) {
      handleNewRide(result);
    }
  }, []);
  const handleDeleteActivity = async () => {
    if (formState.id) {
      if (await handleDelete()) {
        await deleteActivity(formState as AnyActivityT);
        hideModal();
        reset();
      }
    }
  };
  const { handleCancel, handleClose, handleDelete } = useModalLayout();

  return (
    <ModalLayout
      title={title}
      defaultSnap={1}
      snapPoints={[0.5, 0.75, 1]}
      description={description}
      hideModal={isDirty ? handleCancel : handleClose}
      showModal={!!showModal}
      onModalUnmount={() => {
        hideModal();
        reset({});

      }}
      footer={{
        handleSubmit,
        isDirty,
        handleDelete: formState.id ? handleDeleteActivity : undefined,
      }}
    >
      <div key={formKey} className="flex flex-col gap-4">
        <FormField label={t("components.activities.field", {
          field: t("common.fields.title"),
        })}>
          <ControlledInput
            readOnly={isReadOnly}
            id="title"
            placeholder={t("common.placeholders.title")}
            Field={Field}
          />

        </FormField>
        <FormField label={t("components.activities.field", {
          field: t("common.fields.description"),
        })}>
          <ControlledTextarea
            readOnly={isReadOnly}
            id="description"
            placeholder={t("common.placeholders.description")}
            Field={Field}
            numberOfLines={4}
          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.type"),
          })}
        >
          <ControlledSelectInput
            readOnly={isReadOnly}
            defaultValue={formState.type?.id || ""}
            id="type"
            placeholder={t("common.placeholders.type")}
            Field={Field}
            type="object"
            options={selectOptions}
            suffix={selectSuffix}
            extraChildren={selectExtraChildren}

          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.dt_start"),
          })}
        >

          <ControlledInput
            readOnly={isReadOnly}
            id="dt_start"
            placeholder={t("common.placeholders.date")}
            defaultValue={formState.dt_start}
            Field={Field}
            type="datetime-local"
          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.dt_end"),
          })}
        >
          <ControlledInput
            readOnly={isReadOnly}
            id="dt_end"
            placeholder={t("common.placeholders.date")}
            Field={Field}
            type="datetime-local"
          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.recurrence"),
          })}
        >

          <RecurrenceActivity form={form as any} editable={!isReadOnly} />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.notes"),
          })}
        >
          <ControlledTextarea
            readOnly={isReadOnly}
            id="notes"
            placeholder={t("common.placeholders.notes")}
            Field={Field}
            numberOfLines={4}
          />
        </FormField>
        {formState.type && (
          <ActivityByType
            handleClickNewRideItinerary={handleClickNewRideItinerary}
            initialValue={formState as AnyActivityT}
            Field={Field as any}
            form={form as any}
            editable={!isReadOnly}
            activityType={
              typeActivities?.find((type: TypeActivity) => String(type.id) === String(formState.type))?.family || ""
            }
          />)
        }
      </div>
    </ModalLayout>
  );

};


export default ActivitiesModal;