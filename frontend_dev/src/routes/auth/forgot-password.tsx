import { createFileRoute } from "@tanstack/react-router";
import IconApp from "@/components/ui/icon-app";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPassword,
})


function ForgotPassword() {
  return (
    <div className="z-10 flex flex-1  flex-col  items-center justify-between  px-8 pt-16 pb-10 w-full">

      {/* Logo en haut */}
      <div className="w-full flex items-center justify-center ">
        <IconApp size="large" />
      </div>

      {/* Titre + bouton en bas */}
      <div className="flex flex-1 flex-col h-1/2 w-full my-10 max-w-md lg:mx-auto  ">
        <ForgotPasswordForm />
      </div>
    </div >
  );
}
