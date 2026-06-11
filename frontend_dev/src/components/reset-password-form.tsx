import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup
} from "@/components/ui/field";
import { ControlledInput } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useForm, useStore } from "@tanstack/react-form";
import { FormField } from "./ui/form-field";
import { useAuth } from "@/lib/auth/use-auth";
import { useState } from "react";
import { z } from "zod";



export function ResetPasswordForm({
  resetPasswordToken,
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"form"> & { resetPasswordToken?: string; onSubmit?: (data: { password: string; code: string }) => void }) {
  const [errors, setErrors] = useState<string | null>(null);
  const { resetPassword, status } = useAuth();
  const { t } = useTranslation();
  const resetPasswordFormValidator = z.object({
    code: z.string().min(2, {
      message: t("common.errors.invalid", {
        field: t("components.reset_password.code")
      })
    }),
    password: z.string().min(6, { message: t("components.sign_up.password_description") }),
  });

  const { Field, handleSubmit, store } = useForm({
    defaultValues: {
      password: "",
      code: resetPasswordToken || "",
    },
    validators: {
      onChange: resetPasswordFormValidator,
    },
    onSubmit: async (props) => {
      try {
        await resetPassword({
          password: props.value.password,
          code: props.value.code,
        });
        setErrors(null);
        alert("not implemented yet");
      } catch (error) {
        console.error("Error resetting password:", error);
        setErrors("Failed to reset password. Please try again.");
      }
    },
  });


  const code = useStore(store as any, (state) => state.values.code);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }
      }
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("components.reset_password.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("components.reset_password.description")}
          </p>
        </div>
        <FormField label={t("components.reset_password.code")} required>

          <ControlledInput
            Field={Field}
            id="code"
            type="text"
            placeholder={t("components.reset_password.code")}
            required
          />

        </FormField>
        {code && <FormField label={t("components.reset_password.new_password")} required>
          <ControlledInput
            Field={Field}
            id="password"
            type="password"
            placeholder={t("components.reset_password.new_password")}
            required
          />

        </FormField>}

        <Button type="submit" loading={status === "loading"}>{t("components.reset_password.reset_action")}</Button>
        {errors && (
          <FieldError errors={[{ message: errors }]} />
        )}

      </FieldGroup>
    </form >
  );
}
