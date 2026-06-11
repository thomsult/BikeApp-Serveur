import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup
} from "@/components/ui/field";
import { ControlledInput } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "@tanstack/react-router";
import { FormField } from "./ui/form-field";
import { z } from "zod";
import { useRef, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { t } = useTranslation();
  const router = useRouter();
  const [errors, setErrors] = useState<string | null>(null);
  const signUpFormValidator = z.object({
    name: z.string().min(2, { message: t("common.errors.invalid", { field: t("components.sign_up.full_name") }) }),
    email: z.email(t("common.errors.invalid_email")),
    password: z.string().min(6, t("common.errors.invalid", { field: t("components.sign_up.password") })),
    confirmPassword: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: t("common.errors.password_mismatch"),
        code: "custom",
      });
    }
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signUpFormValidator,
    },
    onSubmit: async ({ value }) => {
      console.info("Submitting Sign up form with values:", value);
      const res = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password,
      );
      if (res.user) {
        await sendEmailVerification(res.user);
        router.navigate({
          to: "/auth/sign-in",
          search: { email: value.email },
        });

      }
    },
  });
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }
  const email = useStore(form.store, (state) => state.values.email);





  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}
      onChange={() => setErrors(null)}

      className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("components.sign_up.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("components.sign_up.description")}
          </p>
        </div>
        <FormField label={t("components.sign_up.full_name")} required>
          <ControlledInput Field={form.Field} id="name" type="text" placeholder={t("components.sign_up.full_name_placeholder")} required />
        </FormField>
        <FormField label={t("components.sign_up.email")} required>
          <ControlledInput Field={form.Field} id="email" type="email" placeholder={t("components.sign_up.email_placeholder")} required />
        </FormField>
        <FormField label={t("components.sign_up.password")} required>
          <ControlledInput Field={form.Field} id="password" type="password" placeholder="******" required security="true" />
        </FormField>
        <FormField label={t("components.sign_up.confirm_password")} required>
          <ControlledInput Field={form.Field} id="confirmPassword" type="password" placeholder="******" required security="true" />
        </FormField>

        <Button type="submit">{t("components.sign_up.create_account")}</Button>
        {errors && (
          <FieldError errors={[{ message: errors }]} />
        )}

        <Field>

          <FieldDescription className="px-6 text-center">
            {t("components.common.already_have_account")} <Link to="/auth/sign-in" search={{ email }}>{t("components.sign_up.sign_in")}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
