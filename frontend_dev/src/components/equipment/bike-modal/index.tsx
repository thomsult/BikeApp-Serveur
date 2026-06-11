import { useForm, useStore } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import {
  useAllBikes,
  useCreateBike,
  useDeleteBike,
  useUpdateBike,
} from "@/lib/api/equipments";
import type { Bike } from "@/lib/api/equipments/bike";
import { useAllTypeBikes } from "@/lib/api/equipments/type-bike";
import { Toast } from "@/lib/notification/toast-context";
import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput } from "@/components/ui/input";
import { ControlledSelectInput } from "@/components/ui/select-input";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ControlledInputCheckbox } from "@/components/ui/input-checkbox";
import { ControlledInputRange } from "@/components/ui/input-range";
import { MaintenanceBikeModal } from "./maintenance-bike-modal";
import { ControlledInputFile } from "@/components/ui/input-file";
import { StatsBikeModal } from "./stats-bike-modal";
import BikeModalAccessories from "../bike-accessories";
import { useBikeValidator } from "./validator";
import { client, fileToBase64 } from "@/lib/api/common";
import { useEffect, useState } from "react";
export const BikeModal = ({
  showModal,
  hideModal,
}: {
  showModal: (Partial<Bike> & { refer?: string }) | null;
  hideModal: (refer?: string) => void;
}) => {
  const { t } = useTranslation();
  const { data: bikes } = useAllBikes();
  const validator = useBikeValidator();
  const { mutateAsync: createBike } = useCreateBike();
  const { mutateAsync: updateBike } = useUpdateBike();
  const { mutateAsync: deleteBike } = useDeleteBike();
  const { data: bikeType } = useAllTypeBikes(); // Récupère les types de vélos pour le select
  const defaultValues = {
    // id: Math.random().toString(36).substring(2, 9), // Génération d'un ID temporaire pour les nouveaux vélos
    name: "",
    type: bikeType ? bikeType[0] : undefined,
    refer: showModal?.refer, // Conserve la référence pour le retour après fermeture
    preferred: false,
    status: 0,
    image: null,
    components: [],
    stats: {
      distance: 0,
      rides: 0,
      lastService: null,
      service: {
        method: "manual",
        manualNote: "",
      },
    },
  } as Partial<Bike> & { refer?: string };
  // useForm de @tanstack/react-form
  const form = useForm({
    defaultValues: showModal?.id ? showModal : defaultValues,
    validators: {
      onChange: validator
    },
    onSubmitInvalid() {
      Toast.error({
        title: t("common.errors.validationError", {
          message: "",
        }),
        message: t("common.errors.correctFormErrors"),
      });
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.image && value.image instanceof File) {
          const base64File = await fileToBase64(value.image);
          const response = await client.uploadFile(
            { assets: value.image ? [{ base64: base64File, fileName: `bike_${value.name}.jpg` }] : [] },
            "bike")
          if (response?.fileUrl) {
            value.image = response.fileUrl;
          } else {
            throw new Error("File upload failed");
          }
        }
        if (!value?.id) {
          await createBike(value);
        } else {
          await updateBike(value);
        }

        reset();
        hideModal(value.refer);
      } catch (error) {
        console.error("Error submitting bike form:", error);
        Toast.error({
          title: t("common.errors.validationError", {
            message: "",
          }),
          message: t("common.errors.correctFormErrors"),
        });
      }
    },
  });
  const { Field, store, reset, handleSubmit } = form;
  const formState = useStore(store, (s) => s.values);
  const isDirty = useStore(store, (s) => s.isDirty);
  const isValid = useStore(store, (s) => s.isValid);
  const error = useStore(store, (s) => s.errors);

  const { handleCancel, handleClose, handleDelete } = useModalLayout();
  const handleDeleteBike = async () => {
    const res = await handleDelete();
    if (!res) return;
    await deleteBike(formState as Bike);
    hideModal(formState.refer);
  };
  const hasAlreadyPreferredBike = bikes?.some(
    (bike) => bike.preferred && bike.id !== showModal?.id,
  );


  return (
    <ModalLayout
      title={!showModal?.id
        ? t("app.equipment.bikes.addBike")
        : t("app.equipment.bikes.editBike") +
        " :  " +
        (formState.name || t("common.untitled")) +
        " (" +
        formState.type?.label +
        ")"}
      // description={""}
      hideModal={isDirty ? handleCancel : handleClose}
      showModal={!!showModal}
      onModalUnmount={() => {
        reset();
        setTimeout(() => {
          hideModal(formState.refer);
        }, 0);
      }}
      footer={{
        handleSubmit,
        isValid,
        isDirty,
        handleDelete: showModal?.id ? handleDeleteBike : undefined,
      }}

    >


      <div className="gap-4 flex flex-col pt-2 ">
        {/* Contenu du formulaire */}
        <FormField label={t("common.fields.name")} required>
          <ControlledInput
            Field={Field}
            id="name"
            defaultValue={formState.name}
            placeholder="Ex: VTT Canyon"
          />
        </FormField>
        <FormField label={t("common.fields.type")} required>
          <ControlledSelectInput
            Field={Field}
            type="object"
            id="type"
            options={
              bikeType
                ? bikeType.map((typeBike) => ({
                  label: typeBike.label,
                  value: String(typeBike.id),
                  id: typeBike.id,
                }))
                : []
            }
            defaultValue={formState?.type?.id}

          />
        </FormField>
        <FormField label={t("common.bike_preference")}>
          <Card className="bg-background p-4 my-1">
            {hasAlreadyPreferredBike ? (
              <p className="text-sm text-gray-500">
                {t("components.preferred.alreadySelected", {
                  bike: bikes?.find((bike) => bike.preferred)?.name,
                })}
              </p>
            ) : (<>
              <ControlledInputCheckbox
                Field={Field}
                id="preferred"
                label={t("components.preferred.label")}
              />
              {formState.preferred && (
                <p
                  className="text-xs text-gray-400 max-w-lg pb-2 -mt-2 ms-7"
                >
                  {t("components.preferred.labelDescription")}
                </p>
              )}</>
            )}
          </Card>
        </FormField>
        <FormField label={t("common.fields.status")}>
          <Card className="bg-background p-4 my-1 ">
            <p className="ml-2 mt-4 text-center text-xs mb-8">
              {t("components.bike_status.helperText")}
            </p>

            <div className="my-2 mx-4">
              <ControlledInputRange
                Field={Field}
                id="status"

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
        <FormField label={t("common.fields.image")}>
          <ControlledInputFile
            id="image"
            Field={Field}
            accept="image/*"
            placeholder={t("common.placeholders.image")}
          />
        </FormField>
        {/* Components */}
        <FormField
          label={t("common.accessories", {
            count: formState.components
              ? Object.keys(formState.components).length
              : 0,
          })}
        >
          <Field name="components" >
            {({ handleChange }) => (
              <BikeModalAccessories
                bike={formState as Bike}
                onChange={(components) => {
                  handleChange(components);
                }}
              />
            )}
          </Field>
          {/* Ici, tu peux intégrer la gestion des composants via le formulaire si besoin */}
        </FormField>

        {/* maintenance */}
        <FormField label={t("common.maintenance")}>
          <MaintenanceBikeModal />
        </FormField>

        {/* stats du vélo */}
        <FormField label={t("common.fields.stats")}>
          <StatsBikeModal form={form} />
        </FormField>

        {/* Affichage des erreurs de validation */}
        {error && error.length > 0 && (
          <div className="text-red-500 text-sm">
            {t("common.errors.validationError")} :
            {error.map((err, index: number) => (
              <div key={index}>{Object.keys(err).map((key) => {
                return (<p key={key}>
                  {`- ${err[key].map((e) => e.message + "." + ` (${e.path})`).join(", ")}`}
                </p>);
              })}</div>
            ))}
          </div>
        )}
      </div>

    </ModalLayout >

  );
};
