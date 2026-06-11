import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput } from "@/components/ui/input";
import { InputCheckbox } from "@/components/ui/input-checkbox";
import { ControlledInputRange } from "@/components/ui/input-range";
import { ControlledSelectInput } from "@/components/ui/select-input";
import { useAllBikes, useCreateComponentBike, useDeleteComponentBike, useUpdateBike, useUpdateComponentBike } from "@/lib/api/equipments";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";
import { useAllComponentBikeBrands } from "@/lib/api/equipments/component/components-brands";
import { useAllComponentBikeTypes } from "@/lib/api/equipments/component/components-type";
import type { ID } from "@/lib/api/types";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccessoriesBikeValidator } from "./validator";


export const AccessoriesBikeModal = ({
  bike,
  showModal,
  hideModalWithAction,
}: {
  bike?: Partial<Bike>;
  showModal: ComponentBike & { refer?: string } | null;
  hideModalWithAction: (
    action:
      | "createComponentBike"
      | "updateComponentBike"
      | "deleteComponentBike"
      | "cancel",
    component: ComponentBike | null,
  ) => void;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: createComponentBike } = useCreateComponentBike();
  const { mutateAsync: saveComponentBike } = useUpdateComponentBike();
  const { mutateAsync: deleteComponentBike } = useDeleteComponentBike();
  const { mutateAsync: updateBike } = useUpdateBike();
  const { data: bikes } = useAllBikes();
  const { data: componentBikeType = [] } = useAllComponentBikeTypes();
  const { data: componentBikeBrands = [] } = useAllComponentBikeBrands();
  const accessoriesBikeModalValidators = useAccessoriesBikeValidator();

  const { Field, handleSubmit, reset, store } = useForm({
    defaultValues: {
      ...showModal,
      status: Number(showModal?.status) || 0, // Assurez-vous que le status est un nombre
    } as Partial<ComponentBike> & { refer?: string },
    onSubmit: ({ value }) => {
      console.info("Submitting form with values:", value);
      handleSave(value);
    },
    onSubmitInvalid: ({ value, errors }) => {
      console.warn("Form submission failed with values:", value);
      console.warn("Validation errors:", store.state.errors);
    },
    validators: {
      onChange: accessoriesBikeModalValidators,
    },
  });
  const { formState, isDirty, isValid } = useStore(store, (s) => ({
    formState: s.values,
    isDirty: s.isDirty,
    isValid: s.isValid,
  }));
  const { handleCancel, handleClose, handleDelete } = useModalLayout();


  const handleSave = async (value: Partial<ComponentBike & { refer?: string }>) => {

    if (!value || !value.id) {
      reset();
      hideModalWithAction(
        "createComponentBike",
        await createComponentBike(value as ComponentBike),
      );
      return;
    } else {
      const updatedComponents = {
        ...value,
        updatedAt: new Date().toISOString(),
      };
      try {
        reset(updatedComponents as ComponentBike & { refer?: string }, {
          keepDefaultValues: true,
        }); // Mettre à jour le formulaire avec les nouvelles valeurs
        const savedComponent = await saveComponentBike(updatedComponents as ComponentBike);
        hideModalWithAction("updateComponentBike", savedComponent);
      } catch (error) {
        console.warn(
          "Erreur lors de la sauvegarde du composant :",
          error.response.data.errors,
        );
        reset(); // Revenir à l'état initial en cas d'erreur
      }

      return;
    }
  };

  const handleDeleteComponent = async () => {
    const res = await handleDelete();
    if (!res) return;
    await deleteComponentBike(formState as ComponentBike);
    hideModalWithAction("deleteComponentBike", formState as ComponentBike);
  };
  const isNewComponent = formState && (!formState.id || formState.id === "");

  return (
    <ModalLayout
      title={
        isNewComponent
          ? t("components.accessories.addNew")
          : t("components.accessories.edit")

      }
      description={
        isNewComponent
          ? t("components.accessories.details")
          : t("common.actions.edit") + `: ${store.state.values.brand?.label} ${store.state.values.model}`
      }
      hideModal={isDirty ? handleCancel : handleClose}
      showModal={!!showModal}
      onModalUnmount={() => {
        reset();
        setTimeout(() => {
          hideModalWithAction("cancel", null);
        }, 0);
      }}
      footer={{
        handleSubmit,
        isValid: true,
        isDirty,
        handleDelete: formState?.id ? handleDeleteComponent : undefined,
      }}

    >
      <div className="flex flex-col gap-4">
        <FormField label={t("common.fields.componentType")} required>
          <ControlledSelectInput
            Field={Field}
            type="object"
            defaultValue={formState?.type?.id}
            id="type"
            options={componentBikeType.map(({ id, label }) => ({
              label: label,
              value: String(id),
              id: id as ID,
            }))}
            placeholder={t("common.placeholders.componentType")}
          />
        </FormField>
        <FormField label={t("common.fields.brand")} required>
          <ControlledSelectInput
            Field={Field}
            id="brand"
            type="object"
            defaultValue={formState?.brand?.id || null}
            options={componentBikeBrands.map(({ id, label }) => ({
              label: label,
              value: String(id),
              id: id as ID,
            }))}
            placeholder={t("common.placeholders.brand")}
          />
        </FormField>
        <FormField label={t("common.fields.model")} required>
          <ControlledInput
            Field={Field}
            id="model"
            defaultValue={formState?.model || ""}
            placeholder={t("common.placeholders.model")}
          />
        </FormField>
        {!bike && (
          <div>
            <Field name="multiBike">
              {(field) => (
                <>
                  <InputCheckbox
                    label={t("common.fields.multiBike")}
                    onChange={(val) => field.handleChange(val)}
                    value={field.state.value || false}
                  />
                  {field.state.value && (
                    <p className="text-sm italic text-muted-foreground mt-2">
                      {t("common.fields.multiBikeDescription")}
                    </p>
                  )}
                </>
              )}
            </Field>
          </div>
        )}
        <FormField label={t("common.fields.status")}>
          <Card className="bg-background p-4 my-1 ">

            <div className="py-2">
              <ControlledInputRange
                colorRange={
                  formState.status && formState.status >= 75
                    ? "bg-green-500"
                    : formState.status && formState.status >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
                Field={Field}
                id="status"
                variant="without-label"

              />
            </div>
            <p className="text-center " >
              {formState.status && formState.status >= 75
                ? t("components.bike_status.good")
                : formState.status && formState.status >= 50
                  ? t("components.bike_status.medium")
                  : t("components.bike_status.low")}
            </p>
          </Card>
        </FormField>
      </div>
    </ModalLayout>
  );
};

