import type { AnyFieldApi } from "@tanstack/react-form";
import { Checkbox } from "./checkbox";
import { Field, FieldGroup, FieldLabel } from "./field";

export const InputCheckbox = ({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) => {
  return (
    <FieldGroup >
      <Field
        orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic"
          checked={value} onCheckedChange={onChange}
        />
        <FieldLabel
          htmlFor="terms-checkbox-basic">
          {label}
        </FieldLabel>
      </Field>
    </FieldGroup>
  );
};

export const ControlledInputCheckbox = ({ Field, id, label }: { Field: any; id: string; label: string }) => {
  return (
    <Field name={id} type="checkbox">
      {(field: AnyFieldApi) => (
        <InputCheckbox
          value={field.state.value}
          label={label}
          onChange={field.handleChange}
        />
      )}
    </Field>
  );
};