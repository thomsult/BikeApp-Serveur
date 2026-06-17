import { getExtLocalLanguage } from "@/lib/i18n/utils";
import type { Profil } from "./profil";
import type { UserResource } from "@/client";

export class UserProfil implements Profil {
  constructor(data?: UserResource) {
    if (data === undefined) {
      return;
    };
    Object.assign(this, data);
  }
  id!: string;
  firstName!: string;
  lastName!: string;
  username!: string;
  name!: string;
  email!: string;
  phone!: string;
  avatarURL!: string;
  birthday!: string;
  firstConnected!: string;
  bio!: string;
  website!: string;
  language: string = getExtLocalLanguage();
  offlineMode!: boolean;
  notifications!: boolean;
  emailNotifications!: boolean;
  pushNotifications!: boolean;
  stats = {} as Profil["stats"];
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}
