import { logout } from "@/lib/auth/use-auth";
import TitleComponent from "./sub-components/title-component";
import FormComponent from "./sub-components/form";
import SwitchComponent from "./sub-components/switch-component";
import LinksComponent from "./sub-components/links-component";
import SelectComponent from "./sub-components/select-component";
import { getInfoApp } from "@/lib/info-app";
import type { url } from "zod";

const settingsConfig = {
  general: {
    title: "Général",
    items: [
      {
        Composant: TitleComponent,
        name: "general",
        disabledLabel: true,
      },
      {
        Composant: FormComponent,
        name: "profil",
        disabledLabel: true,
      },
      {
        Composant: SelectComponent,
        name: "language",
        placeholder: "Langue",
        options: [
          { label: "🇫🇷 Français", value: "fr" },
          { label: "🇬🇧 English", value: "en" },
        ],
      },
      {
        Composant: SwitchComponent,
        name: "darkMode",
      },
      {
        Composant: SwitchComponent,
        name: "offlineMode",
        disabled: true,
      },
      {
        Composant: LinksComponent,
        name: "disconnect",
        button: () => {
          logout({ clear: false });
        },
      },
      {
        Composant: LinksComponent,
        name: "deleteAccount",
        button: () => {
          logout({ clear: true });
        },
      },
    ],
  },
  notifications: {
    title: "Notifications",
    items: [
      {
        Composant: TitleComponent,
        name: "notifications",
        disabledLabel: true,
      },
      {
        Composant: SwitchComponent,
        name: "notifications",
      },
      {
        Composant: SwitchComponent,
        name: "emailNotifications",
      },
      {
        Composant: SwitchComponent,
        name: "pushNotifications",
      },
    ],
  },
  contact: {
    title: "Nous contacter",
    items: [
      {
        Composant: TitleComponent,
        disabledLabel: true,
        name: "contact",
      },
      {
        Composant: LinksComponent,
        url: "https://bikeapp.dpdns.org/#contact",
        name: "rate",
      },
      navigator.share ? {
        Composant: LinksComponent,
        name: "share",
        button: () =>
          navigator.share ? navigator
            .share({
              title: "BikeApp",
              text: "Découvrez BikeApp, l'application de navigation pour les cyclistes !",
              url: "https://bikeapp.dpdns.org",
            })
            .catch((error) => console.error("Error sharing:", error))
            : alert("Le partage n'est pas supporté sur ce navigateur."),
      } : undefined,

      {
        Composant: LinksComponent,
        url: "https://bikeapp.dpdns.org#contact",
        name: "contactUs",
      },
      {
        type: "info",
        name: "about",
        extraKey: getInfoApp(),
      },
    ].filter(Boolean) as any[],
  },
  privacy: {
    title: "Conditions",
    items: [
      {
        Composant: TitleComponent,
        name: "privacy",
        disabledLabel: true,
      },
      {
        Composant: LinksComponent,
        url: "https://bikeapp.dpdns.org/privacy-policy",
        name: "privacyPolicy",
      },
      {
        Composant: LinksComponent,
        url: "https://bikeapp.dpdns.org/terms-of-service",
        name: "termsOfService",
      },
      {
        Composant: LinksComponent,
        url: "https://github.com/example",
        name: "github",
      },
      {
        Composant: LinksComponent,
        url: "https://bikeapp.dpdns.org",
        name: "website",
      },
    ],
  },
};
export default settingsConfig;
