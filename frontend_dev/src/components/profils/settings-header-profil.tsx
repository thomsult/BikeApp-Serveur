import { useFormContext } from "./sub-components/form/context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Profil } from "@/lib/api/profil/profil";
import { useSelector } from "@tanstack/react-store";

export const SettingHeaderProfil = () => {
  const form = useFormContext();
  const formState = useSelector(form.store, (state) => state.values) as Partial<Profil>;

  return (
    <div className="flex flex-col items-center gap-3  ">
      <Avatar className="size-36 ring-2 ring-border shadow-sm">
        <AvatarImage src={formState.avatarURL} />
        <AvatarFallback className="text-lg font-semibold">
          {formState.firstName?.[0] || "P"}
          {formState.lastName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-xl font-bold">
          {formState.firstName || "Prénom"} {formState.lastName || "Nom"}
        </p>
        <p className="text-sm text-muted-foreground">
          {formState.email || "Votre email"}
        </p>
        <p className="text-sm font-medium text-chart-1">
          @{formState.username || "username"}
        </p>
      </div>
    </div>
  );
};