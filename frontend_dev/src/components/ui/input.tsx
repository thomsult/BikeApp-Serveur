import * as React from "react"
import type { AnyFieldApi, AnyFieldGroupApi, AnyFormApi, FieldApi, FieldApiOptions } from "@tanstack/react-form";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { cn, toInputDatetime } from "@/lib/utils"
import { FieldError } from "./field";
import { InputGroup, InputGroupAddon } from "./input-group";
import { format } from "date-fns";

export type InputProps = {
  editable?: boolean;
} & React.ComponentProps<"input">;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      readOnly={props.editable === false}
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function PasswordSuffix({ toggle, show }: { toggle: () => void; show: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        toggle();
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
    >
      {show ? <EyeClosedIcon /> : <EyeOpenIcon />}
    </button>
  )
}



type FieldProps<TField> = {
  name: string;
  children: (field: TField) => React.ReactNode;
};

type ControlledInputProps = InputProps & {
  id: string;
  prefix?: string;
  suffix?: string;
  Field: React.ComponentType<FieldProps<AnyFieldApi>>;
};
export function ControlledInput({ id, Field, ...props }: ControlledInputProps) {
  const [type, setType] = React.useState(props.type);

  return (
    <Field
      name={id}
      children={(field: AnyFieldApi) => (
        <>

          <InputGroup>
            {
              props.prefix && <InputGroupAddon className="bg-transparent dark:bg-input/30 whitespace-nowrap capitalize pr-2">{props.prefix}</InputGroupAddon>
            }
            {
              type === "number" ? <Input

                type="text"
                className={props.prefix ? "border-l-0 rounded-s-none pl-2" : props.suffix ? "border-r-0 rounded-e-none" : ""}
                onChange={(e) => {
                  const value = e.target.value.match(/^\d*\.?\d*/)?.[0] || "";
                  const numberValue = parseFloat(value);
                  const isValid = e.target.value.match(/[^0-9.,]/)?.length > 0 ? false : true;
                  console.log({ value, numberValue, isValid })
                  if (!isNaN(numberValue) && isValid) {
                    field.handleChange(numberValue);
                    props.onChange?.(e);
                  } else if (value === "" || !isValid) {
                    field.handleChange(undefined);
                    props.onChange?.(undefined as any);
                  }
                }}
                defaultValue={field.state.value}
                {...props}

              />
                : type === "datetime-local" ? <Input

                  type="datetime-local"
                  onChange={(e) => {
                    const value = e.target.value;
                    const dateValue = new Date(value);
                    if (!isNaN(dateValue.getTime())) {
                      field.handleChange(dateValue.toISOString());
                    } else {
                      field.handleChange(undefined);
                    }
                  }}

                  value={field.state.value ? toInputDatetime(field.state.value) : ""}
                  {...props}
                />
                  :
                  <Input
                    {...props}
                    onChange={(e) => field.setValue(e.target.value.trim())}
                    defaultValue={field.state.value}
                    className={props.prefix ? "border-l-0 rounded-s-none pl-2" : props.suffix ? "border-r-0 rounded-e-none" : ""}
                    type={type}
                  />
            }

            {props.type === 'password' && <PasswordSuffix show={type === "password"} toggle={() => setType(type === "password" ? "text" : "password")} />}
            {props.suffix && <InputGroupAddon className="bg-transparent dark:bg-input/30 pl-2 whitespace-nowrap capitalize" align="inline-end">{props.suffix}</InputGroupAddon>}
          </InputGroup>

          {field.state.meta.isTouched && !field.state.meta.isValid
            ? <FieldError errors={field.state.meta.errors} className="mt-2" />
            : null
          }
          {field.state.meta.isValidating ? "Validating..." : null}
        </>
      )}
    />
  );
}

export { Input };
