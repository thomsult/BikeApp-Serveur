import type { AnyFieldApi } from "@tanstack/react-form";


import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";
import { Badge } from "./badge";

export default function InputRange({
  className,
  defaultValue,
  value,
  onChange,
  variant = "default",
  colorRange = "bg-primary",
}: {
  className?: string;
  defaultValue?: number[];
  value?: number[];
  onChange?: (value: number[]) => void;
  variant?: "default" | "without-label";
  colorRange?: string;

}) {
  const [progress, setProgress] = React.useState([30]);

  React.useEffect(() => {
    if (value) {
      setProgress(value);
    }
  }, [value]);

  const handleChange = (value: number[]) => {
    setProgress(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="relative flex w-full  flex-col items-center">
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        defaultValue={defaultValue || [0]}
        max={100}
        onValueChange={handleChange}
        step={1}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className={"absolute h-full " + colorRange} />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="block  h-4 w-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          {/* Sticky label */}
          {variant !== "without-label" && (
            <Badge variant="outline" className="absolute scale-150 text-primary  -top-6 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {defaultValue ? defaultValue[0] : 0}%
            </Badge>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      <div className="mt-2">
        {defaultValue ? defaultValue[0] : 0}%
      </div>
    </div>
  );
}


export const ControlledInputRange = ({ Field, id, ...props }: { Field: any; id: string, [key: string]: any }) => {
  return (
    <Field name={id} >
      {(field: AnyFieldApi) => (

        <InputRange
          className="w-full"
          defaultValue={[Number(field.state.value) || 0]}
          onChange={(value) => field.handleChange(value[0])}
          {...props}
        />

      )}
    </Field>
  );
};