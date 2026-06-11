
import { Button } from "@/components/ui/button";
import IconApp from "@/components/ui/icon-app";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmail,
  validateSearch: (search?: Record<string, unknown>) => ({
    email: (search?.email as string) || undefined,
  }),
})

function VerifyEmail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { email } = Route.useSearch();

  useEffect(() => {
    if (email) {
      console.info("Verification email sent to:", email);
      setTimeout(() => {
        console.info("Redirecting to sign-in page after email verification.");
        navigate({ to: "/auth/sign-up", search: { email } });
      }, 5000);
    }
  }, [email, navigate]);

  return (
    <div className="z-10 flex flex-1 flex-col items-center justify-between px-8 pt-16 pb-10 w-full">
      <div className="w-full flex items-center justify-center ">
        <IconApp size="large" />
      </div>
      <div className="flex flex-1 flex-col h-1/2 w-full my-10 max-w-md lg:mx-auto">
        <div className="gap-6">
          <div className="gap-6">
            <div className="gap-1.5">
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {t("components.verify_email.title")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("components.verify_email.description", { email })}
              </p>
            </div>
          </div>
          <Button
            onClick={() => { }}
            variant="ghost"
            className="w-full mt-8"
          >
            {t("components.verify_email.didnt_receive")}
          </Button>
        </div>
      </div>
    </div>
  );
}
