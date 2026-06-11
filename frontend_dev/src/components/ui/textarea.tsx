import * as React from "react"

import { cn } from "@/lib/utils"
import type { AnyFieldApi } from "@tanstack/react-form";

type TextareaProps = React.ComponentProps<"textarea"> & {
  numberOfLines?: number;

};

function Textarea({ className, numberOfLines, ...props }: TextareaProps) {
  return (
    <textarea
      rows={numberOfLines ?? 4}
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content  bg-card min-h-16 w-full rounded-md border border-input  px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}
function ControlledTextarea({ id, Field, ...props }: {
  id: string;
  Field: React.ComponentType<{
    name: string;
    children: (field: AnyFieldApi) => React.ReactNode;
  }>;
} & TextareaProps) {
  return (
    <Field
      name={id}
      children={(field: AnyFieldApi) => {
        const error = field.state.error;
        return (
          <>
            <Textarea
              {...props}
              defaultValue={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}

            />
            {error && (
              <p style={{ color: "red", marginTop: 4, fontSize: 12 }}>
                {error}
              </p>
            )}
          </>
        );
      }}
    />
  );
}

export { Textarea, ControlledTextarea }
