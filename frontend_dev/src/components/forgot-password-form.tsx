import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { ControlledInput } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { FormField } from "./ui/form-field";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "@/lib/auth/use-auth";
import { useState } from "react";
import { AuthStatus } from "@/lib/auth/auth";

export function ForgotPasswordForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"form"> & { onSubmit?: (email: string) => void }) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<string | null>(null);
  const { forgetPassword, status } = useAuth();
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async (props) => {
      try {
        const response = await forgetPassword(props.value.email);
        if (response && response.message) {
          console.info("Password reset email sent successfully:", response.message);
          setErrors(null);
          console.info("Calling onSubmit callback with email:", response);
          alert(response.message);
        }
      } catch (error) {
        setErrors(error.response.data.message || "Failed to send password reset email. Please try again.");
      }
    },
  });


  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
      onChange={() => setErrors(null)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("components.forgot_password.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("components.forgot_password.description")}
          </p>
        </div>
        <FormField label={t("components.forgot_password.email")} required>
          <ControlledInput
            Field={Field}
            id="email"
            type="email"
            placeholder={t("components.sign_up.email_placeholder")}
            required
          />
        </FormField>
        {errors && (
          <FieldError errors={[{ message: errors }]} />
        )}
        <Button size={"lg"} type="submit" >
          {t("components.forgot_password.reset_action")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t("components.forgot_password.remember_password")}
          <a href="/auth/sign-in" className="ms-1 underline underline-offset-4">
            {t("components.forgot_password.back_to_sign_in")}
          </a>
        </p>
      </FieldGroup>
    </form >
  );
}
