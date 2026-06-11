import { formOptions, withForm } from "./form/context";
import { Switch } from "@/components/ui/switch";

const SwitchComponent = withForm({
  defaultValues: { ...formOptions.defaultValues },
  props: {
    name: "",
    disabled: false,
  },
  render: function Render({ form, name, disabled }: { form: any; name: string; disabled: boolean }) {
    const { Field } = form;
    return (
      <Field name={name}>
        {(field: any) => {
          return (
            <Switch
              disabled={disabled}
              checked={field.state.value}
              onCheckedChange={(checked) => {
                field.handleChange(checked);
              }}
            />
          );
        }}
      </Field>
    );
  },
});

export default SwitchComponent;
