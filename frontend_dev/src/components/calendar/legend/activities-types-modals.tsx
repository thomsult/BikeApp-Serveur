import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllActivities } from "@/lib/api/activity";
import {
  activityTypeFamilyConstants,
  useAllTypeActivities,
  useCreateTypeActivity,
  useDeleteTypeActivity,
  useUpdateTypeActivity,
} from "@/lib/api/type-activity";
import type { TypeActivity } from "@/lib/api/type-activity/type-activity";
import { CheckIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import z from "zod";
import { Toast } from "@/lib/notification/toast-context";
import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput, Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { FieldError } from "@/components/ui/field";
import { SelectInput } from "@/components/ui/select-input";
import { alertsConfirmation } from "@/components/alerts";

interface ActivityTypesModalsProps {
  showModal: (TypeActivity & { refer?: string }) | null;
  hideModal: (refer?: string) => void;
}

const AVAILABLE_COLORS = [
  "#FF7B1A",
  "#33FF57",
  "#3357FF",
  "#33FFF5",
  "#F5FF33",
  "#FF33A8",
];

export const ActivityTypesModals = ({
  showModal,
  hideModal,
}: ActivityTypesModalsProps) => {
  const { t } = useTranslation();
  const { mutate: createTypeActivity } = useCreateTypeActivity();
  const { mutate: updateTypeActivity } = useUpdateTypeActivity();
  const { mutate: deleteTypeActivity } = useDeleteTypeActivity();
  const { data: typeActivities = [] } = useAllTypeActivities();
  const { data: allActivities } = useAllActivities();
  const isDefault = showModal?.isDefault || false;

  const ActivityTypesModalsValidators = useMemo(() => z.object({
    label: z
      .string()
      .min(3, { message: t("components.legend.typeName.minLength") })
      .max(30, {
        message: t("components.legend.typeName.maxLength", { max: 30 }),
      })
      .refine(
        (value: string): boolean =>
          !typeActivities.some(
            (type: TypeActivity): boolean =>
              type.label.toLowerCase() === value.toLowerCase() &&
              type.id !== showModal?.id,
          ),
        { message: t("components.legend.typeName.exists") },
      )
    ,
    color: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: t("components.legend.typeColor.invalid"),
      })
      .refine((value) => typeof value === "string" && (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value.trim())),
        {
          message: t("components.legend.typeColor.invalid"),
        })
      .refine(
        (value: string): boolean =>
          !typeActivities.some(
            (type: TypeActivity): boolean =>
              type.color === value && type.id !== showModal?.id,
          ),
        { message: t("components.legend.typeColor.exists") },
      )
    ,
    family: z.string(),
    _isInvoked: z.boolean(),
  }), [t, typeActivities, showModal?.id]);


  const defaultValues: TypeActivity & { refer?: string } = useMemo(() => ({
    id: showModal?.id || "",
    label: showModal?.label || "",
    color: showModal?.color || AVAILABLE_COLORS[0],
    family:
      showModal?.family ||
      activityTypeFamilyConstants[activityTypeFamilyConstants.length - 1],
    _isInvoked: showModal?._isInvoked || false,
  }), [showModal]);

  const { Field, reset, handleSubmit, store, setFieldValue } = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      console.log("Submitting form with value:", value);
      if (formState?.id) {
        updateTypeActivity({
          createdAt: formState.createdAt,
          updatedAt: new Date().toISOString(),
          ...value,
        });
      } else {
        createTypeActivity({
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...value,
        });
      }
      reset();
      hideModal(showModal?.refer || "");
    },
    onSubmitInvalid: (e) => {
      console.warn("Invalid form submission", e.formApi.getAllErrors());
      Toast.error({
        title: t("common.errors.validationError", {
          message: "",
        }),
        message: t("common.errors.correctFormErrors"),
      });
    },
    validators: {
      onChange: ActivityTypesModalsValidators,
    }
  });
  const formState = useStore(store, (state) => state.values);
  const isDirty = useStore(store, (state) => state.isDirty);
  const editing = !!showModal?.id;

  useEffect(() => {
    if (showModal?._isInvoked) {
      setFieldValue("label", defaultValues.label);
      setFieldValue("color", defaultValues.color);
      setFieldValue("family", defaultValues.family);
    }
  }, [
    defaultValues.color,
    defaultValues.family,
    defaultValues.label,
    showModal,
    setFieldValue,
  ]);

  const {
    handleCancel,
    handleClose,
    handleDelete,
  } = useModalLayout();

  const handleDeleteActivityType = async () => {
    if (!formState?.id) return;

    const linkedActivities = allActivities?.filter(
      (activity) => activity.type === formState.id,
    );

    if (linkedActivities?.length) {
      const confirmed = await alertsConfirmation({
        button: {
          confirm: t("common.actions.delete"),
          cancel: t("common.actions.cancel"),
        },
        title: t("common.alerts.deleteConfirmationTitle"),
        message: t("components.legend.deleteWithActivitiesConfirmation", {
          count: linkedActivities?.length || 0,
        }),
      })

      if (confirmed) {
        deleteTypeActivity(formState);
        reset();
        hideModal(showModal?.refer || "");
      }
    } else {
      const confirmed = handleDelete();
      if (!confirmed) return;
      deleteTypeActivity(formState);
      reset();
      hideModal(showModal?.refer || "");
    }
  };

  // rendering info removed to avoid console noise and extra side-effects
  return (
    <ModalLayout
      title={
        editing
          ? t("components.legend.editTypeTitle")
          : t("components.legend.newTypeTitle")
      }
      description={t("components.legend.helperText")}
      defaultSnap={1}
      snapPoints={[0.55]}

      hideModal={isDirty ? handleCancel : handleClose}
      showModal={!!showModal}
      onModalUnmount={() => {
        reset();
        setTimeout(() => {
          hideModal();
        }, 0);
      }}
      footer={{
        handleSubmit,
        isDirty,
        handleDelete: !isDefault && editing ? handleDeleteActivityType : undefined,
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Nom */}
        <FormField label={t("components.legend.typeName.label")} required>
          <ControlledInput
            id="label"
            Field={Field as any}
            name="label"
            placeholder={t("components.legend.typeName.placeholder")}
            autoFocus={!editing}
          />
        </FormField>


        {/* Couleur — palette */}
        <FormField label={t("components.legend.typeColor.label")} required>
          <Field
            name="color"
            validators={{
              onSubmit: ({ value }) => {
                if (!AVAILABLE_COLORS.includes(value))
                  return t("components.legend.typeColor.invalid");
                return typeActivities?.some(
                  (type) => type.color === value && type.id !== formState?.id,
                )
                  ? t("components.legend.typeColor.exists")
                  : undefined;
              },
            }}
          >
            {(field) => (
              <div className="flex flex-wrap items-center gap-2 ">
                {AVAILABLE_COLORS.map((color) => {
                  const isSelected = field.state.value === color;
                  const disabled = typeActivities?.some(
                    (type) =>
                      type.color === color && type.id !== formState?.id,
                  );
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={disabled}
                      onClick={() => field.setValue(color)}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border-2 transition-transform",
                        isSelected ? "scale-110 border-foreground" : "border-border",
                        disabled && "pointer-events-none opacity-30",
                      )}
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && (
                        <CheckIcon size={14} className="text-white" />
                      )}
                    </button>
                  );
                })}


                <button
                  type="button"
                  onClick={() => field.setValue("")}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-border"
                >
                  {field.state.value === "" ? (
                    <PlusIcon size={14} className="text-muted-foreground" />
                  ) : (
                    <span
                      className="flex size-full items-center justify-center rounded-full"
                      style={{ backgroundColor: field.state.value as string }}
                    >
                      <CheckIcon size={14} className="text-white" />
                    </span>
                  )}
                </button>
                <p className="w-full text-sm font-medium">
                  {t("components.legend.typeColor.labelHex")}
                </p>
                <InputGroup className="">
                  <Input
                    placeholder="#RRGGBB"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                    className="border-0"
                  />
                  <InputGroupAddon

                    className="bg-transparent pl-2 whitespace-nowrap" align={"inline-end"}>
                    {t("common.colorsHex")}
                  </InputGroupAddon>


                </InputGroup>
                {field.state.meta.isTouched && !field.state.meta.isValid
                  ? <FieldError errors={field.state.meta.errors} className="mt-2" />
                  : null
                }
              </div>
            )
            }
          </Field >
        </FormField >
        {/* Famille */}
        <FormField label={t("components.legend.typeFamily.label")} required>
          {!isDefault ? (
            <Field name="family">
              {(field) => (
                <SelectInput
                  options={activityTypeFamilyConstants.map((family) => ({
                    label:
                      t(`common.activity-type.family.${family}`) ||
                      family.charAt(0).toUpperCase() + family.slice(1),
                    value: family,
                  }))}
                  defaultValue={field.state.value}
                  handleChange={(option) =>
                    field.setValue(option as TypeActivity["family"])
                  }
                />
              )}
            </Field>
          ) : (
            <Input
              value={t(`common.activity-type.family.${defaultValues.family}`)}
              disabled
            />
          )}
        </FormField>
      </div>

    </ModalLayout >
  )
};