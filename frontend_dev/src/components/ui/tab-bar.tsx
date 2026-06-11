import { Link } from "@tanstack/react-router";
import { BikeIcon, CalendarDaysIcon, HomeIcon, WarehouseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import IconApp from "./icon-app";
import { useAuth } from "@/lib/auth/use-auth";
import { Avatar } from "../avatar";

export const NAV_ITEMS = [
  { icon: CalendarDaysIcon, title: "app.calendar.title", key: "calendar", href: "/calendar" },
  { icon: WarehouseIcon, title: "app.equipment.title", key: "equipment", href: "/equipment" },
  { icon: BikeIcon, title: "app.rides.title", key: "rides", href: "/ride" },
  { icon: HomeIcon, title: "app.home.title", key: "home", href: "/" },
];
export const TabsBar = ({
  active,
  hidden
}: {
  active: string;
  hidden?: boolean;
}) => {
  const { t } = useTranslation();

  const { user } = useAuth();

  const classItemDesktop = (key: string) => `flex items-center justify-center w-11 h-11 rounded-xl transition-colors
  ${active === key
      ? "bg-primary/10 text-primary"
      : "text-gray-400 hover:bg-primary/10 hover:text-primary/80"}`;

  const classItemMobile = (key: string) => `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors
  ${active === key
      ? "text-primary"
      : "text-gray-400 hover:text-primary/90  hover:bg-primary/10 "}`;

  const fallback =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "P";

  if (hidden) return null;

  return (
    <>
      {/* Mobile — barre en bas */}
      <nav className="md:hidden z-50 fixed bottom-4 left-1/2 -translate-x-1/2 w-[98%] md:w-full   flex justify-around bg-white/90 backdrop-blur-md border border-gray-200 px-2 py-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-card dark:border-gray-700">
        {NAV_ITEMS.map(({ icon: Icon, title, key, href }) => (
          <Link
            key={key + "-mobile"}
            to={href}
            className={classItemMobile(key)}
          >
            <Icon />
            <span className="text-[11px] font-medium">{t(title)}</span>
          </Link>
        ))}

      </nav>

      {/* Desktop — sidebar */}
      <nav className="hidden z-50  md:flex fixed top-0 left-0 h-screen w-16 flex-col items-center gap-2 bg-white border-r border-gray-100 pt-4 dark:bg-card dark:border-gray-700">
        <Link
          to="/"
          title={t("app.home.title")}
          className={classItemDesktop("home") + " mb-4"}
        >
          <IconApp size="medium" />
        </Link>
        {[...NAV_ITEMS].reverse()
          .map(({ icon: Icon, title, key, href }) => (
            <Link
              key={key + "-desktop"}
              to={href}
              title={t(title)}
              className={classItemDesktop(key)}
            >
              <Icon />
            </Link>
          ))}

        <Avatar className="mt-auto mb-4" image={user?.photoURL || ""} fallback={fallback} />

      </nav>
    </>
  );
};