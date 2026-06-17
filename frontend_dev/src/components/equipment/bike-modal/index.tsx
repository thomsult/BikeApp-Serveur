import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import {
  useAllBikes,
  useCreateBike,
  useDeleteBike,
  useUpdateBike,
} from "@/lib/api/equipments";
import { useAllTypeBikes } from "@/lib/api/equipments/type-bike";
import { Toast } from "@/lib/notification/toast-context";
import { ModalLayout, useModalLayout } from "@/components/layout/modal-layout";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput } from "@/components/ui/input";
import { ControlledSelectInput } from "@/components/ui/select-input";
import { Card } from "@/components/ui/card";
import { ControlledInputCheckbox } from "@/components/ui/input-checkbox";
import { ControlledInputRange } from "@/components/ui/input-range";
import { MaintenanceBikeModal } from "./maintenance-bike-modal";
import { ControlledInputFile } from "@/components/ui/input-file";
import { StatsBikeModal } from "./stats-bike-modal";
import BikeModalAccessories from "../bike-accessories";
// import { useBikeValidator } from "./validator";
import { useSelector } from "@tanstack/react-store";
import type { BikeResource, CreateBikeRequest } from "@/client";
import { zCreateBikeRequest } from "@/client/zod.gen";
import z from "zod";
import { useEffect } from "react";

export type BikeModalDefaultValues = Partial<z.infer<typeof zCreateBikeRequest>> & { id?: string, refer?: string }

const convertBikeResourceToDefaultValues = (bike: BikeResource): BikeModalDefaultValues => {
  return {
    name: bike.name || "Untitled",
    type_bike_id: Number(bike.type?.id),
    preferred: bike.preferred ?? false,
    status: bike.status ?? 100,
    image_url: bike.image,
    components: bike.components?.map((c) => c.id) || [],
    stats: {
      distance: Number(bike.stats?.distance || 0),
      rides: Number(bike.stats?.rides || 0),
      last_service_date: bike.stats?.lastService || null,
      service: {
        method: bike.stats?.service?.method as CreateBikeRequest['stats']['service']['method'] || "none",
        interval_distance: Number(bike.stats?.service?.intervalDistance || 0),
        interval_time: Number(bike.stats?.service?.intervalTime || 0),
        interval_rides: Number(bike.stats?.service?.intervalRides || 0),
        manual_note: bike.stats?.service?.manualNote || null,
      },
    },
  };
}
const convertDefaultValuesToBikeResource = (values: BikeModalDefaultValues): CreateBikeRequest => {
  return {
    name: values.name || "Untitled",
    type_bike_id: Number(values.type_bike_id || 0),
    preferred: values.preferred || false,
    status: values.status || 100,
    image_url: values.image_url,
    components: values.components || [],
    stats: {
      distance: Number(values.stats?.distance || 0),
      rides: Number(values.stats?.rides || 0),
      last_service_date: values.stats?.last_service_date || null,
      service: {
        method: values.stats?.service?.method as CreateBikeRequest['stats']['service']['method'] || "none",
        interval_distance: Number(values.stats?.service?.interval_distance || 0),
        interval_time: Number(values.stats?.service?.interval_time || 0),
        interval_rides: Number(values.stats?.service?.interval_rides || 0),
        manual_note: values.stats?.service?.manual_note || null,
      },
    },
  };
}


export const BikeModal = ({
  showModal,
  hideModal,
}: {
  showModal: (Partial<BikeResource> & { refer?: string }) | null;
  hideModal: (refer?: string) => void;
}) => {
  const { t } = useTranslation();
  const { data: bikes } = useAllBikes();
  // const validator = useBikeValidator();
  const { mutateAsync: createBike } = useCreateBike();
  const { mutateAsync: updateBike } = useUpdateBike();
  const { mutateAsync: deleteBike } = useDeleteBike();
  const { data: bikeType } = useAllTypeBikes(); // Récupère les types de vélos pour le select


  const defaultValues: BikeModalDefaultValues = {
    id: showModal?.id,
    refer: showModal?.refer,
    ...convertBikeResourceToDefaultValues(showModal as BikeResource),
  };

  useEffect(() => {
    if (showModal) {
      reset(defaultValues);
    }
  }, [showModal]);

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onChange: zCreateBikeRequest,
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
        // if (value.image && typeof value.image === "object") {
        //   const response = await uploadFile(
        //     { assets: value.image ? [{ base64: value.image.base64, fileName: `bike_${value.name}.jpg` }] : [] },
        //     "bike")
        //   if (response?.fileUrl) {
        //     value.image = response.fileUrl;
        //   } else {
        //     throw new Error("File upload failed");
        //   }
        // }
        const bikeData = convertDefaultValuesToBikeResource(value);
        if (!value?.id) {
          await createBike({ body: bikeData });
        } else {
          await updateBike({ path: { bike: Number(value.id) }, body: bikeData });
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
  const formState = useSelector(store, (s) => s.values);
  const isDirty = useSelector(store, (s) => s.isDirty);
  const isValid = useSelector(store, (s) => s.isValid);
  const error = useSelector(store, (s) => s.errors);

  const { handleCancel, handleClose, handleDelete } = useModalLayout();
  const handleDeleteBike = async () => {
    const res = await handleDelete();
    if (!res || !formState.id) return;
    await deleteBike({ path: { bike: Number(formState.id) } });
    hideModal(formState.refer);
  };
  const hasAlreadyPreferredBike = bikes?.some(
    (bike) => bike.preferred && bike.id !== showModal?.id,
  );
  const bikeTypeLabel = bikeType?.find((type) => Number(type.id) === Number(formState.type_bike_id))?.label || t("common.untitled");


  return (
    <ModalLayout
      title={!showModal?.id
        ? t("app.equipment.bikes.addBike")
        : t("app.equipment.bikes.editBike") +
        " :  " +
        (formState.name || t("common.untitled")) +
        " (" +
        bikeTypeLabel +
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
            defaultValue={formState?.type_bike_id}

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
            accept="image/jpeg,image/png,image/gif,image/webp"
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
                bike={formState}
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
              <div key={index}>{Object.keys(err as Record<string, unknown>).map((key) => {
                return (<p key={key}>
                  {`- ${(err as Record<string, any>)[key].map((e: any) => e.message + "." + ` (${e.path})`).join(", ")}`}
                </p>);
              })}</div>
            ))}
          </div>
        )}
      </div>

    </ModalLayout >

  );
};
