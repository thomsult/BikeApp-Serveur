import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/lib/i18n/language-selector";
import ThemeSelector from "@/lib/theme/theme-selector";

export const PublicLayout = ({ welcome, children }: { welcome: boolean, children: React.ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter()
  const canGoBack = useCanGoBack()
  return (
    <div className={
      "flex flex-col lg:flex-row w-full"
    } >
      {!welcome && <div
        className="fixed z-100 flex gap-2 h-8 top-4 left-4 rounded-md bg-secondary p-1 text-primary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary/80"
      >
        {canGoBack && <button onClick={() => { router.history.back() }} >
          <p className="flex items-center gap-1 text-2xl">
            <ChevronLeftIcon width="22" height="22" />
          </p>
        </button>}
        <LanguageSelector />
        <ThemeSelector />
      </div>}
      {/* ── GAUCHE : Image (cachée sur mobile, visible lg+) ── */}
      <div className="lg:block lg:w-1/2 relative">
        <img
          className="fixed z-0 inset-0 w-full h-full object-cover"
          src={
            import.meta.env.VITE_PUBLIC_BASE_URL +
            "/assets/images/onboarding/1.webp?v=" +
            Date.now()
          }
          alt="Welcome Background"
        />
      </div>
      {/* <div className={`absolute inset-0 lg:hidden ${welcome ? 'bg-black/0' : 'bg-card'}`} /> */}
      {/* ── DROITE / MOBILE : Contenu ── */}
      <div className="relative lg:bg-card bg-card min-h-screen   flex flex-col w-full items-center justify-center lg:w-1/2 ">
        {/* Image de fond sur mobile uniquement */}
        {welcome && <><img
          className="fixed inset-0 w-full h-full object-cover lg:hidden"
          src={
            import.meta.env.VITE_PUBLIC_BASE_URL +
            "/assets/images/onboarding/1.webp?v=" +
            Date.now()
          }
          alt="Welcome Background"
        />
          <div className={`absolute inset-0 bg-gradient-to-t lg:bg-none from-black/90 via-black/50 to-black/10  ${welcome ? '' : 'bg-card'}`} />
          <p className="absolute bottom-4 text-xs text-center w-full text-white/40 lg:dark:text-white/40 lg:text-gray-400">
            {t("app.index.by_bikeapp")}
          </p></>}
        {/* Contenu */}
        {children}
      </div>
    </div >
  );
};