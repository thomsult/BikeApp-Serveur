import { useTranslation } from "react-i18next";
import { FieldSeparator } from "./field";
import { Button } from "./button";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth/use-auth";
import { useRouter } from "@tanstack/react-router";
export default function SocialConnections() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      if (!tokenResponse.access_token) {
        console.error("Google login failed: No token received");
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(
        null, // ID token is not used in this flow
        tokenResponse.access_token
      );

      const res = await signInWithCredential(auth, googleCredential);
      if (!res.user) {
        throw new Error("No user found in sign-in result");
      }
      await signIn(res.user);
      router.navigate({ to: "/" });
    },
    onError: error => {
      console.error("Google login failed:", error);
      signOut();
    }
  });
  return (
    <div className="flex flex-col gap-6 mt-6 w-full ">
      <FieldSeparator> {t("components.social_connections.or")}</FieldSeparator>
      <GoogleButton onPress={googleLogin} />
    </div>
  );
}

const GoogleButton = ({ onPress }: { onPress: () => void }) => {
  const { t } = useTranslation();
  return (
    <Button
      size={"lg"}
      onClick={onPress}
      className="w-full rounded-md bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
      <img src="/assets/images/google-icon.png" alt="Google Logo" className="h-5 w-5 mr-2" />
      {t("components.social_connections.sign_in_with_google")}
    </Button>

  );
};