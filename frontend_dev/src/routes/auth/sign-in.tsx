
import { createFileRoute, useSearch } from "@tanstack/react-router";
import IconApp from "@/components/ui/icon-app";
import SocialConnections from "@/components/ui/social-connections";
import { SigninForm } from "@/components/signin-form";

export const Route = createFileRoute('/auth/sign-in')({
  component: SignIn,
  validateSearch: (search?: Record<string, unknown>) => ({
    email: (search?.email as string) || undefined,
  }),
})


function SignIn() {

  const { email } = useSearch({ strict: false }) as { email?: string };
  return (
    <div className="z-10 flex flex-1  flex-col  items-center justify-between  px-8 pt-16 pb-10 w-full">
      {/* Logo en haut */}
      <div className="w-full flex items-center justify-center ">
        <IconApp size="large" />
      </div>
      {/* Titre + bouton en bas */}
      <div className="flex flex-1 flex-col h-1/2 w-full my-10 max-w-md lg:mx-auto  ">
        <SigninForm email={email} />
        <SocialConnections />
      </div>
    </div>
  );
}
