import { useGreeting } from "@/lib/hooks/use-greeting";
import { Avatar } from "../avatar";
import { useMyProfil } from "@/lib/api/profil";
import { useTranslation } from "react-i18next";
import { HeadroomHeader } from "../ui/headroom-header";


// ── HeaderProfile ────────────────────────────────────────────────────────────
const HeaderProfile = ({ home, title, hidden }: { home: boolean; title: string; hidden?: boolean }) => {
  const greeting = useGreeting();
  const { data: user } = useMyProfil();
  const { t } = useTranslation();


  return !hidden && (
    <HeadroomHeader
      className={`bg-card border-muted border-b md:ml-16 lg:ml-0`}>
      <div className="flex items-center gap-3 px-5 py-3 lg:pl-20   mx-auto">
        <div className="flex flex-col flex-1">
          {home && (
            <span className="text-xs tracking-wide font-medium opacity-60">
              {greeting}
            </span>
          )}
          <span className="text-2xl font-bold leading-tight mt-0.5">
            {home ? `${user?.lastName} ${user?.firstName}` : t(title)}
          </span>
        </div>
        <Avatar className="md:hidden rounded-full flex items-center focus:outline-none focus:ring-2 hover:scale-105 hover:shadow-lg transition-transform duration-200 focus:ring-indigo-400 focus:ring-offset-2 gap-4" image={user?.avatarURL || ""} fallback={user?.firstName?.[0] + (user?.lastName?.[0] || "") || "P"} />
      </div>
    </HeadroomHeader>
  );
};


export { HeaderProfile };
