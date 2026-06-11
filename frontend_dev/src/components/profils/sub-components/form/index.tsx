import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { formOptions, withForm } from "./context";
import { FormField } from "@/components/ui/form-field";

type FormValues = typeof formOptions.defaultValues;
type FieldType = "email" | "phone" | "text" | "multiline" | "date" | "url";
type FormFieldName = keyof FormValues;

interface FormFieldComponentProps {
  label: string;
  type: FieldType;
  value: FormFieldName;
  readOnly?: boolean;
}
type SingleField = {
  label: string;
  value: FormFieldName;
  type: FieldType;
  defaultValue?: string;
  readOnly?: boolean;
};

type GroupField = {
  label: string;
  form: SingleField[];
  readOnly?: boolean;
};

type FormViewItem = SingleField | GroupField;

const FormComponent = withForm({
  defaultValues: { ...formOptions.defaultValues },
  render: function Render({ form }) {
    const { AppField } = form;
    const { t } = useTranslation();
    const formView: FormViewItem[] = [
      { label: t("common.fields.username"), value: "username", type: "text" },
      {
        label: t("common.fields.fullName"),
        type: "text",
        form: [
          {
            value: "firstName",
            label: t("common.fields.firstName"),
            type: "text",
          },
          {
            value: "lastName",
            label: t("common.fields.lastName"),
            type: "text",
          },
        ],
      },
      { label: t("common.fields.email"), value: "email", type: "email", readOnly: true },
      { label: t("common.fields.phone"), value: "phone", type: "phone" },
      // { label: t("common.fields.address"), value: "address", type: "text" },
      // { label: t("common.fields.location"), value: "location", type: "text" },
      { label: t("common.fields.avatarURL"), value: "avatarURL", type: "url" },
      { label: t("common.fields.bio"), value: "bio", type: "multiline" },
      { label: t("common.fields.website"), value: "website", type: "url" },
      {
        label: t("common.fields.birthday"),
        value: "birthday",
        type: "date",
        defaultValue: new Date().toISOString(),
      },
    ];
    const FormFieldComponent = useCallback(
      (props: FormFieldComponentProps) => {
        const { label, type, value, readOnly } = props;
        return (
          <FormField label={label}>
            <AppField name={value}>
              {type === "date"
                ? (field) => <field.DateTimeField field={field} readOnly={readOnly} />
                : type === "multiline"
                  ? (field) => (
                    <field.MultiLineField field={field} numberOfLines={4} readOnly={readOnly} />
                  )
                  : (field) => <field.TextField type={type} field={field} readOnly={readOnly} />}
            </AppField>
          </FormField>
        );
      },
      [AppField],
    );

    return (
      <div className="flex flex-1 flex-col gap-4">
        {formView.map((item, index) =>
          "form" in item ? (
            <div key={index} className="flex flex-row justify-between gap-4">
              {item.form.map((subItem, subIndex) => (
                <div key={subIndex} className="flex flex-1">
                  <FormFieldComponent
                    label={subItem.label}
                    type={subItem.type}
                    value={subItem.value}
                    readOnly={subItem.readOnly}
                  />
                </div>
              ))}
            </div>
          ) : (
            <FormFieldComponent
              key={index}
              label={item.label}
              type={item.type}
              value={item.value || item.defaultValue || ""}
              readOnly={item.readOnly}
            />
          ),
        )}
      </div>
    );
  },
});

export default FormComponent;
