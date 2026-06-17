import axios, { type AxiosInstance } from "axios";

import { getStorageToken, setStorageToken } from "@/lib/auth/utils";
import { auth } from "@/lib/firebase/config";
import { logout } from "@/lib/auth/use-auth";
import { client } from '@/client/client.gen';
import { getExtLocalLanguage } from "@/lib/i18n/utils";


const clientAxios = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
}) as AxiosClientWithUpload;

export const createClientConfig = (_: unknown) => ({
  axios: clientAxios,
});


// --- Interceptor de requêtes : injecte toujours le token si présent ---
clientAxios.interceptors.request.use(
  async (config) => {
    const token = getStorageToken();
    const language = getExtLocalLanguage();
    if (language) {
      config.headers["Accept-Language"] = language;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(
      "Request error in interceptor:",
      JSON.stringify(error, null, 2),
    ); // Debug log to check request error in interceptor
    UnauthenticatedRequest(error.config, error);
  },
);

// --- Gestion du refresh token ---
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    }
    if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

clientAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return clientAxios(originalRequest);
          })
          .catch((err) => UnauthenticatedRequest(originalRequest, err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user found");
        }
        const response = await user.getIdToken(true);
        setStorageToken(response);

        clientAxios.defaults.headers.common.Authorization = `Bearer ${response}`;

        processQueue(null, response);

        return clientAxios(originalRequest);
      } catch (err) {
        return UnauthenticatedRequest(originalRequest, err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const uploadFile = async (
  file: {
    assets?: {
      base64?: string;
      fileName?: string;
    }[];
  },
  type: "bike" | "ride" | "component",
) => {
  try {
    const fileUpload = file.assets?.[0];
    if (!fileUpload) {
      throw new Error("No file selected");
    }
    const base64Data = fileUpload.base64;
    if (!base64Data) {
      throw new Error("No base64 data found in file");
    }
    const token = getStorageToken();
    if (!token) {
      throw new Error("No token found for file upload");
    }
    const response = await axios.post(
      `${import.meta.env.VITE_PUBLIC_BASE_URL}/api/upload`,
      {
        file: base64Data,
        ext: fileUpload.fileName?.split(".").pop() || "jpg",
        type: type,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Utiliser un token de développement ou de test
        },
      },
    );
    return { fileUrl: response?.data?.path as string };
  } catch (error) {
    return Promise.reject(error);

  }
};

type AxiosClientWithUpload = AxiosInstance & {
  uploadFile: (
    file: any,
    type: "bike" | "ride" | "component",
  ) => Promise<{ fileUrl: string } | void>;
};

export { client };

const UnauthenticatedRequest = async (request: any, error: any) => {
  // Gérer la requête non authentifiée ici

  logout();
  window.location.href = "/login"; // Rediriger vers la page de connexion
  console.error("Requête non authentifiée:", error, "Request config:", request);
  return Promise.reject(
    new Error("Requête non authentifiée", { cause: error }),
  );
};


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]; // Supprimer le préfixe data:image/jpeg;base64,
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getUploadedFileUrl = async (
  fileUrl: string,
): Promise<string> => {
  const token = getStorageToken();
  if (!token) {
    throw new Error("No token found for file access");
  }
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_PUBLIC_BASE_URL}/api${fileUrl}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      },
    );
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching uploaded file:", error);
    throw error;
  }
};