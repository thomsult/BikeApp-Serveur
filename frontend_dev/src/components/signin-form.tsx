import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup, FieldSeparator
} from "@/components/ui/field";
import { ControlledInput } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Link, useRouter } from "@tanstack/react-router";
import { FormField } from "./ui/form-field";
import { useAuth } from "@/lib/auth/use-auth";
import { useForm } from "@tanstack/react-form";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { z } from "zod";
export function SigninForm({
  className,
  email,
  ...props
}: React.ComponentProps<"form"> & { email?: string }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<string | null>(null);
  const { t } = useTranslation();
  const signInFormValidator = z.object({
    email: z
      .string()
      .refine((val) => val === "" || z.email().safeParse(val).success, {
        message: t("common.errors.invalid_email"),
      }),

    password: z.string().refine((val) => val === "" || val.length >= 6, {
      message: t("components.sign_up.password_description"),
    }),
  });
  const form = useForm({
    defaultValues: {
      email: email || "",
      password: "",
    },
    validators: {
      onChange: signInFormValidator,
    },
    onSubmit: async ({ value }) => {

      try {
        console.info("Submitting Sign in form with values:", value);
        const res = await signInWithEmailAndPassword(
          auth,
          value.email,
          value.password,
        );
        if (!res.user) {
          console.error("Sign in failed: No user returned from Firebase.");
          return;
        }
        if (res.user && !res.user.emailVerified) {
          await sendEmailVerification(res.user);
          onEmailSubmitEditing();
          console.info("Email not verified. Verification email sent to:", res.user.email);
        } else {
          console.info(
            "User signed in successfully:",
            JSON.stringify(res.user, null, 2),
          );
          await signIn(res.user as any);
          router.navigate({ to: "/" });
        }
      } catch (error) {

        setErrors(t("common.errors.invalid_email_or_password"));
      }
    },
  });



  const passwordInputRef = useRef<HTMLInputElement>(null);


  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onChange={() => setErrors(null)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("components.sign_in.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("components.sign_in.description")}
          </p>
        </div>
        <FormField label={t("components.sign_in.email")} required>
          <ControlledInput
            id="email"
            Field={form.Field}
            type="email"
            placeholder={t("components.sign_up.email_placeholder")}
            defaultValue={email}
            required
          />
        </FormField>
        <FormField label={t("components.sign_in.password")} required>
          <ControlledInput
            id="password"
            security="true"
            Field={form.Field}
            type="password"
            placeholder={t("components.sign_in.password")}
            required
          />
        </FormField>


        <Field>
          <Button size={"lg"} type="submit">{t("components.sign_up.sign_in")}</Button>
        </Field>
        {errors && (
          <FieldError errors={[{ message: errors }]} />
        )}
        <Field>
          <FieldDescription className="px-6 text-center">
            <Link to="/auth/forgot-password">{t("components.sign_in.forgot_password")}</Link>
          </FieldDescription>
        </Field>
        <FieldSeparator />
        <Field>
          <FieldDescription className="px-6 text-center">
            {t("components.common.dont_have_account")} <Link to="/auth/sign-up">{t("components.sign_in.sign_up")}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>

  )
}
