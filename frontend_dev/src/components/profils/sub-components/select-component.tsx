
import { formOptions, withForm } from "./form/context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SelectComponent = withForm({
  defaultValues: { ...formOptions.defaultValues },
  props: {
    name: "",
    options: [] as { label: string; value: string }[],
    placeholder: "",
  },
  render: function Render({ form, ...props }) {
    const { options, name, placeholder } = props;

    return (

      <form.Field name={name as any}>
        {(field) => {
          return (
            <Select onValueChange={(value) => field.handleChange(value)} defaultValue={field.state.value}>
              <SelectTrigger aria-invalid>
                <SelectValue defaultValue={
                  options.find(
                    (option) => option.value === field.state.value,
                  )?.value
                } placeholder={placeholder}

                />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      </form.Field>

    );
  },
});
export default SelectComponent;
