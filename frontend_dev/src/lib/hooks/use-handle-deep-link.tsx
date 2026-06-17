
import { useCallback, useEffect, useRef, useState } from "react";
import { client } from "../api/common";
import { Alert } from "../notification/alert-context";
import { useRouter, useSearch } from "@tanstack/react-router";



const useHandleDeepLink = <T extends { id?: string | number }>({
  path,
  show,
  hide,
  originalPath = "/(app)",
}: {
  path: string;
  originalPath?: string;
  show: (
    params: T & { [path]: any | T["id"] | string; refer?: string },
  ) => void;
  hide: () => void;
}) => {
  const router = useRouter();
  const params = useSearch({ strict: false }) as {
    [path]?: any | string;
    share_link?: string;
    refer?: string;
    [key: string]: any;
  };

  // ✅ On garde toujours la dernière version de show/hide sans les mettre dans les deps
  const showRef = useRef(show);
  const hideRef = useRef(hide);
  useEffect(() => {
    showRef.current = show;
  }, [show]);
  useEffect(() => {
    hideRef.current = hide;
  }, [hide]);

  const parseValue = (value: any): any => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const stringifyValue = (value: any): string => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  useEffect(() => {
    const fetchSharedRide = async (shareLink: string) => {
      try {
        const response = await client.get(`/activities/share/${shareLink}`, {});
        const data = response.data;
        return data;
      } catch (error) {
        const errorData = error.response?.data || error;
        throw new Error(errorData.message || "Failed to fetch shared ride data");
      }
    };

    if (!router) return;
    if (params.share_link) {
      const share_link = params.share_link as string;
      delete params.share_link;
      fetchSharedRide(share_link)
        .then((navigationParams) => {
          // storage.set(
          //   "new_ride_itinerary" + "new",
          //   JSON.stringify(navigationParams),
          // );
          setTimeout(() => {
            // On supprime le paramètre de partage pour éviter les boucles
            router.navigate({
              to: originalPath as any,
              // params: {
              //   id: "rides",
              //   refer: params.refer || null,
              // },
            });
          }, 0);
        })
        .catch((error) => {
          Alert.alert("Lien de partage invalide", error.message, [
            { text: "OK", onPress: () => { } },
          ]);
          setTimeout(() => {
            router.navigate({
              to: originalPath as any,
            });
          }, 0);
        });
      return;
    }
    if (params[path]) {
      const parsedParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          acc[key] = parseValue(value);
          return acc;
        },
        {} as any,
      ) as T;

      // ✅ On appelle via le ref — plus de dépendance instable sur show
      showRef.current(parsedParams);

      router.navigate({
        to: originalPath as any,
        replace: true,
      });
    }
  }, [originalPath, params, path, router]); // ✅ show retiré des deps

  const navigate = useCallback(
    (navParams?: { id: string }): void => {
      if (!router) return;
      const navigationParams: Record<string, string> = {
        [path]: navParams?.id || "new",
      };
      if (navParams) {
        Object.entries(navParams).forEach(([key, value]) => {
          if (key !== "id" && value !== undefined) {
            navigationParams[key] = stringifyValue(value);
          }
        });
      }
      console.info("Navigating with deep link params:", originalPath, navigationParams);
      requestAnimationFrame(() => {
        router.navigate({
          to: originalPath as string,
          search: navigationParams,
        });
      });
    },
    [router, path, originalPath],
  );

  const resetNavigate = useCallback((refer?: string) => {
    if (!router) return;

    // ✅ On appelle via le ref
    hideRef.current();
    console.info(
      "Resetting navigation to original path:",
      originalPath,
      "with refer:",
      refer,
      params,
    );

    if (params.path || refer) {
      const url = params.path as string;
      const queryString = url?.split("?")[1] || "";
      const paramsObj = Object.fromEntries(
        new URLSearchParams(queryString).entries(),
      );
      if (refer) {
        paramsObj.refer = refer;
      }
      if (paramsObj.refer) {
        const refer = paramsObj.refer;
        delete paramsObj.refer;
        console.info(
          "Navigating to refer path:",
          refer,
          "with params:",
          paramsObj,
        );
        requestAnimationFrame(() => {
          router.navigate({
            to: (refer === "index"
              ? "/(app)"
              : `/(app)/${refer}`) as string,
            search: paramsObj,
          });
        });
        return;
      }
    }

    requestAnimationFrame(() => {
      router.navigate({
        to: originalPath as string,
        search: {},
      });
    });
  }, [router, originalPath]);

  return {
    navigate,
    resetNavigate,
  };
};

export default useHandleDeepLink;
