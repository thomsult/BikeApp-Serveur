import type { AnyFieldApi } from "@tanstack/react-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemWithIndicator, SelectTrigger, SelectValue } from "./select";
import { FieldError } from "./field";
import React from "react";
import type { ID } from "@/lib/api/types";

export interface optionsProps { label: string; value: string, id: ID | string | undefined };
interface SelectInputProps {
  options: optionsProps[];
  readOnly?: boolean;
  placeholder?: string;
  defaultValue?: string | number | ID | null;
  handleChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  suffix?: string | ((value: string) => string);
  extraChildren?: () => React.ReactNode;
}
export const SelectInput = ({ options, placeholder, defaultValue, handleChange, invalid, disabled, suffix, extraChildren, readOnly }: SelectInputProps) => {
  const isEmpty = options.length === 0;

  const safeValue = !isEmpty && options.some(opt => String(opt.value) === String(defaultValue))
    ? String(defaultValue)
    : undefined;

  return (
    <Select onValueChange={handleChange} defaultValue={safeValue} disabled={disabled || readOnly}>
      <SelectTrigger aria-invalid={invalid} className="w-full bg-card">
        <SelectValue placeholder={placeholder} />
        <span className="text-muted-foreground flex-1 text-right">
          {suffix && safeValue && (
            typeof suffix === "function"
              ? suffix(safeValue)
              : suffix
          )}
        </span>
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup className="bg-card w-full">
          {options.map((option, index) => {
            if (suffix) {
              return (
                <SelectItemWithIndicator key={index} extended={typeof suffix === "function" ? suffix(option.value) : suffix} value={option.value} className="w-full flex items-center justify-between gap-2">
                  {option.label}
                </SelectItemWithIndicator>
              );
            }

            return <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>;
          })}
          {extraChildren && <div className="p-2 hover:bg-accent rounded-md">
            {extraChildren()}
          </div>}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const ControlledSelectInput = ({ id, Field, options, placeholder, ...props }: {
  id: string;
  type: "string" | "object";
  options: optionsProps[];
  Field: React.ComponentType<{
    name: string;
    children: (field: AnyFieldApi) => React.ReactNode;
  }>;
} & Omit<SelectInputProps, "handleChange">) => {

  return (
    <Field
      name={id}
      children={(field: AnyFieldApi) => {
        return (<>
          <SelectInput
            invalid={field.state.meta.isTouched && !field.state.meta.isValid}
            options={options}
            placeholder={placeholder}
            // defaultValue={field.state.value}
            handleChange={(value) => {
              if (props.type === "object") {
                const selectedOption = options.find(opt => opt.value === value);
                field.handleChange(selectedOption);
              } else {
                field.handleChange(value);
              }
            }}
            {...props}
          />
          {
            field.state.meta.isTouched && !field.state.meta.isValid
              ? <FieldError errors={field.state.meta.errors} className="mt-2" />
              : null
          }
          {field.state.meta.isValidating ? "Validating..." : null}
        </>);
      }}
    />
  );
};
