// src/config/packageInfo.ts

import { t } from "i18next";
import pkg from "../../package.json";
export const getAllDependencies = () => ({
  ...pkg.dependencies,
  ...pkg.devDependencies,
});

export const cleanVersion = (version?: string): string => {
  if (!version) return "unknown";
  return version.replace(/^[^0-9]*/, "");
};
export const DEPENDENCIES_TO_DISPLAY = [
  {
    label: "React",
    packageName: "react",
  },
  {
    label: "Mapbox",
    packageName: "@rnmapbox/maps",
  },
];
export type DependencyInfo = {
  name: string;
  version: string;
};

export const getDependenciesInfoAsObject = (): DependencyInfo[] => {
  const deps = getAllDependencies();

  return DEPENDENCIES_TO_DISPLAY.map(({ label, packageName }) => ({
    name: label,
    version: cleanVersion(deps?.[packageName as keyof typeof deps]),
  }));
};

export function getInfoApp(): string[] {

  const appName = "BikeApp";
  const version = "1.0.0";
  const buildNumber = "1";
  const uri = window.location.href;
  const backendUrl = import.meta.env.VITE_PUBLIC_BASE_URL;

  const dependenciesInfo = getDependenciesInfoAsObject().map(
    ({ name, version }) => `${name} - Version ${version}`,
  );

  return [
    `${appName} - Version ${version} (Build ${buildNumber})`,
    ...dependenciesInfo,
    `URI: ${uri}`,
    `Backend URL: ${backendUrl}`,
  ];
}

export const getShareAppMessage = (): string => {
  const appName = "BikeApp";
  return t("app.profil.contact.share.shareMessage", { appName });
};
