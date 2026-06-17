import { useStore, type AnyFieldApi, type useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { ControlledInput, Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { CheckCircle2, CheckIcon, Circle } from "lucide-react";
import { format } from "date-fns";
import type { Bike } from "@/lib/api/equipments/bike";
import { useCallback } from "react";
import { useSelector } from "@tanstack/react-store";

// ─── Types ───────────────────────────────────────────────────────────────────
const ServiceMethodValues = {
  useLastServiceDate: "useLastServiceDate",
  distanceInterval: "distanceInterval",
  timeInterval: "timeInterval",
  ridesInterval: "ridesInterval",
  manual: "manual",
  none: "none",
} as const;

const SERVICE_METHODS: ServiceMethod[] = Object.values(ServiceMethodValues);
type ServiceMethod = typeof ServiceMethodValues[keyof typeof ServiceMethodValues];

interface ServiceConfig {
  method: ServiceMethod;
  intervalDistance?: number;
  intervalTime?: number;
  intervalRides?: number;
  manualNote?: string;
}

interface BikeStats {
  distance: number;
  rides: number;
  lastService: string;
  service?: ServiceConfig;
}


const getNextServiceDate = (lastService: string): string => {
  const date = new Date(lastService);
  date.setMonth(date.getMonth() + 6);
  return date.toLocaleDateString();
};

// ─── ServiceMethodInfo ───────────────────────────────────────────────────────

interface ServiceMethodInfoProps {
  method: ServiceMethod;
  lastService: string;
  intervalDistance?: number;
  intervalTime?: number;
  intervalRides?: number;
  manualNote?: string;
}

const ServiceMethodInfo = ({
  method,
  lastService,
  intervalDistance,
  intervalTime,
  intervalRides,
  manualNote,
}: ServiceMethodInfoProps) => {
  const { t } = useTranslation();

  const nextService = (
    method === ServiceMethodValues.useLastServiceDate
      ? getNextServiceDate(lastService)
      : method === ServiceMethodValues.distanceInterval
        ? intervalDistance || 0
        : method === ServiceMethodValues.timeInterval
          ? intervalTime || 0
          : method === ServiceMethodValues.ridesInterval
            ? intervalRides || 0
            : method === ServiceMethodValues.manual
              ? manualNote || ""
              : ""
  ).toString();

  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm text-gray-500">
        {t(`components.services_methods_maintenances.${method}.helperText`)}
      </p>
      {nextService !== "0" && nextService !== "" && (
        <p className="text-sm text-gray-500">
          {t(
            `components.services_methods_maintenances.${method}.helperTextWithDate`,
            { nextService }
          )}
        </p>
      )}
    </div>
  );
};

// ─── ServiceMethodSelector ───────────────────────────────────────────────────

const ServiceMethodSelector = ({
  serviceMethod,
  value,
  Field,
  updateService,
}: {
  serviceMethod: ServiceMethod;
  value: BikeStats;
  Field: AnyFieldApi;
  updateService: (updates: Partial<ServiceConfig>) => void;
}) => {
  const { t } = useTranslation();

  const getFieldConfig = () => {
    switch (serviceMethod) {
      case "distanceInterval":
        return {
          id: "intervalDistance",
          label: "common.stats.distance",
          value: value.service?.intervalDistance?.toString() ?? "",
          update: (v: string) => ({
            intervalDistance: Number.isNaN(Number(v)) ? 0 : Number(v),
          }),
          placeholder: "200",
          suffix: "common.units.distance",
          type: "number",
        };
      case "timeInterval":
        return {
          id: "intervalTime",
          label: "common.stats.times",
          value: value.service?.intervalTime?.toString() ?? "",
          update: (v: string) => ({
            intervalTime: Number.isNaN(Number(v)) ? 0 : Number(v),
          }),
          placeholder: "30",
          suffix: "common.units.days_long",
          type: "number",
        };
      case "ridesInterval":
        return {
          id: "intervalRides",
          label: "common.stats.rides",
          value: value.service?.intervalRides?.toString() ?? "",
          update: (v: string) => ({
            intervalRides: Number.isNaN(Number(v)) ? 0 : Number(v),
          }),
          placeholder: "1000",
          suffix: "common.stats.rides",
          type: "number",
        };
      case "manual":
        return {
          id: "manualNote",
          label: "common.stats.manual",
          value: value.service?.manualNote ?? "",
          update: (v: string) => ({ manualNote: v }),
          placeholder:
            "components.services_methods_maintenances.manual.placeholderNote",
          suffix: "",
          type: "text",
        };
      default:
        return null;
    }
  };

  const config = getFieldConfig();
  if (!config || serviceMethod === ServiceMethodValues.useLastServiceDate || serviceMethod === ServiceMethodValues.none) {
    return null;
  }
  return config.id && (
    <FormField label={t(config.label, { count: 1 }) ?? ""}>
      <ControlledInput
        Field={Field as any}
        id={config.id}
        suffix={
          config.suffix ? t(config.suffix, { count: 1 }) : undefined
        }
        type={config.type}
        placeholder={config.placeholder ? (t(config.placeholder, { count: 1 }) ?? "") : ""}

        defaultValue={config.value}
        onChange={(e) => updateService(config.update(e.target.value))}
      />

    </FormField>
  )
};

// ─── StatsBikeModal ──────────────────────────────────────────────────────────

export const StatsBikeModal = ({
  form,
}: {
  form: ReturnType<typeof useForm> & any;
}) => {
  const { t } = useTranslation();
  const { setFieldValue, Field } = form;
  const formState = useSelector(form.store, (state) => state.values) as Partial<Bike> & { stats: BikeStats };
  const error = useSelector(form.store, (state) => state.errors);
  const serviceMethod = formState.stats?.service?.method ?? ServiceMethodValues.manual;

  const updateStats = useCallback((updates: Partial<BikeStats>) => {
    setFieldValue("stats", {
      ...formState.stats,
      ...updates,
    } as BikeStats);
  }, [formState.stats, setFieldValue]);

  return (
    <div className="rounded-lg border border-border  p-4">
      <Field
        name="stats">
        {(field: AnyFieldApi) => {

          return (
            <div className="flex flex-col gap-3">
              {/* Distance */}
              <FormField label={t("common.stats.distance")}>
                <ControlledInput
                  aria-invalid={formState.stats.distance < 0}
                  Field={Field}
                  id="distance"
                  suffix={t("common.units.distance")}
                  defaultValue={formState.stats.distance}
                  onChange={(e) => {
                    console.log("Distance input changed:", e.target.value);
                    if (e.target.value === "" || e.target.value === "0") {
                      return updateStats({ distance: 0 });
                    }
                    updateStats({ distance: Number(e.target.value) || -1 });
                  }
                  }
                />

              </FormField>

              {/* Rides */}
              <FormField label={t("common.stats.rides", { count: formState.stats.rides || 0 })}>
                <ControlledInput
                  Field={Field}
                  id="rides"
                  aria-invalid={formState.stats.rides < 0}
                  suffix={t("common.stats.rides", { count: formState.stats.rides || 0 })}
                  defaultValue={formState.stats.rides}
                  onChange={(e) => {
                    if (e.target.value === "" || e.target.value === "0") {
                      return updateStats({ rides: 0 });
                    }
                    updateStats({ rides: Number(e.target.value) || -1 });

                  }
                  }
                />
              </FormField>

              {/* Last maintenance date */}

              <FormField label={t("common.stats.last_maintenance")}>
                <ControlledInput
                  type="date"
                  Field={Field}
                  id="lastService"
                  aria-invalid={formState.stats.lastService ? isNaN(new Date(formState.stats.lastService).getTime()) || new Date(formState.stats.lastService) > new Date() : false}
                  defaultValue={formState.stats.lastService ? format(new Date(formState.stats.lastService), "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    const date = new Date(dateValue);
                    if (isNaN(date.getTime())) {
                      updateStats({ lastService: "" });
                    } else {
                      updateStats({ lastService: date.toISOString() });
                    }
                  }
                  }
                />
              </FormField>
              {error && error.length > 0 && (
                <div className="text-red-500 text-sm">
                  {error.map((err, index: number) => (
                    <div key={index}>{Object.keys(err)
                      .filter((key) => key.startsWith("stats."))
                      .map((key) => {
                        return (<p>
                          {`${err[key].map((e) => e.message).join(", ")}`}
                        </p>);
                      })}</div>
                  ))}
                </div>
              )}

              {/* Service method */}
              <FormField
                label={t("components.services_methods_maintenances.title")}
              >
                <div className="my-1 flex flex-col gap-2 mb-4 pt-2">
                  {SERVICE_METHODS.map((methodValue) => (
                    <label
                      key={methodValue}
                      className="flex cursor-pointer items-center py-2"
                    >
                      <input
                        type="radio"
                        name="serviceMethod"

                        value={methodValue}
                        checked={serviceMethod === methodValue}
                        onChange={() =>
                          updateStats({
                            service: { method: methodValue },
                          })
                        }
                        className="hidden accent-primary  peer-data-[selected=true]:ring-2 peer-data-[selected=true]:ring-primary rounded-full"
                      />

                      <span className="text-sm items-center flex gap-2">
                        {serviceMethod === methodValue ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}

                        {t(
                          `components.services_methods_maintenances.${methodValue}.label`
                        )}
                      </span>
                    </label>
                  ))}
                </div>

                <ServiceMethodSelector
                  serviceMethod={serviceMethod}
                  value={formState.stats}
                  Field={Field as any}
                  updateService={(serviceUpdates) => {
                    updateStats({
                      service: {
                        ...formState.stats?.service,
                        method: formState.stats?.service?.method ?? "manual",
                        ...serviceUpdates,
                      },
                    });
                  }}
                />

                <ServiceMethodInfo
                  method={serviceMethod}
                  lastService={formState.stats?.lastService}
                  intervalDistance={formState.stats?.service?.intervalDistance}
                  intervalTime={formState.stats?.service?.intervalTime}
                  intervalRides={formState.stats?.service?.intervalRides}
                  manualNote={formState.stats?.service?.manualNote}
                />
              </FormField>

              {/* Errors */}
              {!field.state.meta.isValid && (
                <p className="mt-1 text-sm text-red-500">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      </Field >
    </div >
  );
};