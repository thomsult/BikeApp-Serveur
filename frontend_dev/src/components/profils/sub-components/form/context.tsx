import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/ui/date-picker";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { useMyProfil, useUpdateMyProfil } from "@/lib/api/profil";
import type { Profil } from "@/lib/api/profil/profil";
import { getExtLocalLanguage } from "@/lib/i18n/utils";
import { useTheme } from "@/lib/theme/use-theme";
import { createFormHook, createFormHookContexts, useStore, type useForm } from "@tanstack/react-form";
import { formatDate } from "date-fns";
import { Link, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";


const formOptions = {
  defaultValues: {
    id: "current",
    firstName: "Thomas",
    lastName: "Sultan",
    name: "Thomas Sultan",
    username: "Thomas Sultan",
    email: "thomsult@gmail.com",
    phone: "+1234567890",
    avatarURL:
      "https://gravatar.com/avatar/43a24a1b3afdd74704c2cfb5b5c95c83a24fa7ca096f64faa1eff021e59badeb",
    birthday: new Date().toISOString(),
    firstConnected: new Date().toISOString(),
    bio: "Passionné de cyclisme et d'aventures en plein air.",
    website: "https://thomsult.dev",
    language: getExtLocalLanguage(),
    offlineMode: true,
    notifications: false,
    emailNotifications: false,
    pushNotifications: false,
    stats: {
      todayStats: { distance: 0, duration: 0, rides: 0, goal: 0 },
      monthlyStats: { distance: 0, duration: 0, rides: 0 },
      weeklyStats: { distance: 0, duration: 0, rides: 0 },
      totalStats: { distance: 0, duration: 0, rides: 0 },
    },
  },
};
export type formContextType = {
  values: typeof formOptions.defaultValues;
} & ReturnType<typeof useForm>;

// export useFieldContext for use in your custom components
const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    TextField: ({
      field,
      type,
      readOnly = false,
    }: {
      field: any;
      type: "email" | "phone" | "text" | "url";
      readOnly?: boolean;
    }) => {
      const error = field.meta?.touched && field.meta.error;
      return (
        <InputGroup>

          <InputGroupInput
            readOnly={readOnly}
            type={type === "phone" ? "tel" : type}
            style={error ? { borderColor: "red", borderWidth: 1 } : undefined}
            value={field.state.value}
            onChange={e => field.handleChange(e.currentTarget.value)}

          />

          {error && (
            <p style={{ color: "red", marginTop: 4, fontSize: 12 }}>
              {error}
            </p>
          )}
          <InputGroupAddon
            align={"inline-end"}>
            {type === "email" && <Mail size={16} />}
            {type === "phone" && <Phone size={16} />}
            {type === "url" && <Link size={16} />}
          </InputGroupAddon>
        </InputGroup>
      );
    },
    MultiLineField: ({
      field,
      numberOfLines,
      readOnly = false,
    }: {
      field: any;
      numberOfLines?: number;
      readOnly?: boolean;
    }) => {
      const error = field.meta?.touched && field.meta.error;
      return (
        <>
          <Textarea
            readOnly={readOnly}
            numberOfLines={numberOfLines ?? 4}
            style={error ? { borderColor: "red", borderWidth: 1 } : undefined}
            value={field.state.value}
            onChange={e => field.handleChange(e.currentTarget.value)}
          />
          {error && (
            <p style={{ color: "red", marginTop: 4, fontSize: 12 }}>
              {error}
            </p>
          )}
        </>
      );
    },

    DateTimeField: ({ field, readOnly = false }: { field: any; readOnly?: boolean }) => {
      const error = field.meta?.touched && field.meta.error;
      return (
        <>

          <DatePickerInput
            value={field.state.value}
            onChangeText={(dateStr) => {
              alert(dateStr);
              field.handleChange(dateStr);
            }}
            format={(date: Date) => date.toISOString()}
            display="dd/MM/yyyy"
            placeholder="Select a date"
            editable={!readOnly}
          />
          {error && (
            <p style={{ color: "red", marginTop: 4, fontSize: 12 }}>
              {error}
            </p>
          )}
        </>
      );
    },
  },

  formComponents: {},
});

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const { mutateAsync: updateProfil } = useUpdateMyProfil();
  const { data: profil } = useMyProfil();
  const { colorScheme, setColorScheme } = useTheme();
  const { t } = useTranslation();
  const { AppForm, store, handleSubmit, reset } = useAppForm({
    defaultValues: {
      ...(profil ?? formOptions.defaultValues),
      darkMode: colorScheme === "dark",
    },
    onSubmit: async ({ value }: { value: Profil & { darkMode?: boolean } }) => {
      console.log("Submitting form with values:", value);

      // applique directement le dark mode
      const darkMode = value.darkMode ?? false;
      setColorScheme(darkMode ? "dark" : "light");

      const { data } = await updateProfil({
        ...value,
        birthday: value.birthday ? formatDate(new Date(value.birthday), "yyyy-MM-dd") : undefined,
        name: `${value.firstName} ${value.lastName}`,
      });

      // reset avec les bonnes valeurs
      reset({
        ...data,
        darkMode: value.darkMode ?? false,
      }, { keepDefaultValues: true });
    },
  });
  const formState = useStore(store, (state) => state);
  return (
    <AppForm>
      {children}
      <div
        className="flex fixed md:z-10 z-100 left-0  gap-3  h-14  w-screen bottom-0">
        <div
          className={` flex lg:w-2xl lg:rounded-t-xl w-full lg:mx-auto  bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 lg:border-l lg:border-r border-t border-gray-200 dark:border-gray-700 shadow-md  transition-all duration-300 ease-in-out ${formState.isDirty
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
            }`}
        >
          <Button
            className="flex-1"
            size="lg"
            variant="ghost"
            onClick={() => reset()}
            children={t("common.actions.cancel")}
          />
          <Button
            className="flex-1"
            size="lg"
            variant="default"
            onClick={handleSubmit}
            children={t("common.actions.save")}
          />
        </div>
      </div>
    </AppForm>
  );
};
export { useAppForm, withForm, useFieldContext, useFormContext, formContext, fieldContext, formOptions, FormProvider };
