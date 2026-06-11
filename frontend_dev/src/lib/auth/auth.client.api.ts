import axios from "axios";
import { getIdToken } from "firebase/auth";

if (!import.meta.env.VITE_PUBLIC_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

export const auth = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL,
});

export const signInServer = async (authClient: any, tokenPush?: string) => {
  const user = authClient.currentUser;
  let token: string | null = null;
  if (user) {
    token = await getIdToken(user, true); // auto refresh si expiré
  }
  return auth.post(
    "/auth/login",
    {},
    {
      headers: {
        ...{ Authorization: `Bearer ${token}` },
        ...(tokenPush ? { "X-Push-Token": tokenPush } : undefined),
        "X-Platform": "web"
      },
    },
  );
};
export const signOutServer = async (authClient: any, clear?: boolean) => {
  const user = authClient.currentUser;
  let token: string | null = null;
  if (user) {
    token = await getIdToken(user, true); // auto refresh si expiré
  }

  return auth.post(
    "/auth/logout",
    {
      removeUser: !!clear,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const forgetPasswordServer = async (email: string) => {
  return auth.post("/auth/forget-password", { email });
};

export const resetPasswordServer = async (data: {
  password: string;
  code: string;
}) => {
  return auth.post("/auth/reset-password", data);
};  
