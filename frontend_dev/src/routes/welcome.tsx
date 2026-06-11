import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTheme } from "../lib/theme/use-theme";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import IconApp from "@/components/ui/icon-app";
import { useCallback } from 'react';
import SocialConnections from '@/components/ui/social-connections';
export const Route = createFileRoute('/welcome')({
  component: Welcome,
})

export default function Welcome() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="z-10 flex h-dvh flex-col  items-center justify-between  px-8 pt-16 pb-10 w-full ">
      {/* Logo en haut */}
      <div className="w-full flex items-center justify-center mt-14 ">
        <IconApp size="géant" />
      </div>
      {/* Titre + bouton en bas */}
      <div className="flex flex-col h-1/2 gap-6 w-full max-w-sm lg:mx-auto ">
        <div className="flex flex-col gap-1">
          <p className="dark:text-white text-white lg:text-black text-base font-medium">
            {t("app.index.welcome")}
          </p>
          <h1
            className="dark:text-white text-white lg:text-black text-7xl font-bold" >
            BikeApp
          </h1>
        </div>
        <Button
          className="w-full  rounded-xl bg-primary py-6 mt-16  text-base font-semibold text-white hover:bg-primary/90 active:bg-primary/80"
          onClick={useCallback(() => router.navigate({ to: '/auth/sign-up', search: { email: "" } }), [router])}
        >
          {t("app.index.login_with_email")}
        </Button>
        <SocialConnections />
      </div>
    </div>
  );
}