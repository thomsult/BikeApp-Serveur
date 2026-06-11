import { NAV_ITEMS, TabsBar } from "../ui/tab-bar";

import { HeaderProfile } from "./header";
import { RidesProvider } from "../rides/rides-context";
import { useLocation } from "@tanstack/react-router";

const hiddenHeaderPaths = ["/ride", "/ride/new", "/ride/[id]"];
const hiddenTabBarPaths = ["/profile"];

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = NAV_ITEMS.find(item => item.href === pathname);
  const tilesString = active ? active.title : "Profile";

  return (<>
    <div >
      <HeaderProfile
        home={active?.key === "home"}
        title={tilesString}
        hidden={hiddenHeaderPaths.includes(pathname)}
      />

      <RidesProvider>
        {active?.key === "rides" ?
          children
          : <main className="px-4 mb-24 pt-4">{children} <div /></main>}
      </RidesProvider>

    </div> <TabsBar active={active?.key || "home"} /></>
  );
}
