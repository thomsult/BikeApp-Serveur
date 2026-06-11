
import { getIdToken, onAuthStateChanged, signOut as signOutFB, type User } from "firebase/auth";
import { auth } from "../firebase/config";
import { type AuthState, AuthStatus } from "./auth";
import { forgetPasswordServer, signInServer, signOutServer } from "./auth.client.api";
import { create } from "zustand";
import { queryClient } from "../api/common";
import { removeStorageToken, setStorageToken } from "./utils";


export const useAuth = create<AuthState>((set, get) => ({
  status: AuthStatus.idle,
  user: null,

  signIn: async (user) => {
    if (!user) {
      set({ status: AuthStatus.signOut, user: null });
      return null;
    }

    try {
      set({ status: AuthStatus.loading });
      const tokenPush = ""; // await registerForPushNotificationsAsync();
      const user = auth.currentUser;
      let token: string | null = null;
      if (user) {
        token = await getIdToken(user, true); // auto refresh si expiré
      }
      if (token) {
        setStorageToken(token);
      }


      await signInServer(auth, tokenPush);

      set({
        status: AuthStatus.signIn,
        user,
      });
      localStorage.setItem("auth_user", JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("[Auth] signIn failed:", error);

      await signOutFB(auth);

      set({
        status: AuthStatus.signOut,
        user: null,
      });
      localStorage.removeItem("auth_user");
      removeStorageToken();

      return null;
    }
  },

  signOut: async ({ clear } = {}) => {
    try {
      set({ status: AuthStatus.loading });

      await signOutServer(auth, clear);

      await signOutFB(auth);
    } catch (error) {
      console.error("[Auth] signOut failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      removeStorageToken();
      queryClient.clear();
      set({
        status: AuthStatus.signOut,
        user: null,
      });
      location.href = "/welcome";
      location.reload();
    }
  },

  hydrate: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ status: AuthStatus.signOut, user: null });
        localStorage.removeItem("auth_user");
        return;
      }

      try {
        set({ status: AuthStatus.loading });

        await get().signIn(user as any);
      } catch (error) {
        console.error("[Auth] hydrate error:", error);
        set({ status: AuthStatus.signOut, user: null });
        localStorage.removeItem("auth_user");
        removeStorageToken();

      }
    });

    return unsubscribe;
  },
  resetPassword: async ({ password, code }: { password: string; code: string }) => {
    set({ status: AuthStatus.loading });
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            console.info("Password reset successful for code:", code, "with password:", password);
            // await confirmPasswordReset(auth, code, password);
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });
      set({ status: AuthStatus.signIn }); // ou un status dédié "success"
    } catch (error) {
      console.error("[Auth] resetPassword failed:", error);
      set({ status: AuthStatus.signOut });
    }
  },
  forgetPassword: async (email: string) => {
    set({ status: AuthStatus.loading });
    try {
      const response = await forgetPasswordServer(email);
      if (response.status === 200) {
        return response.data;
      }
      else {
        return Promise.reject(new Error("Failed to send password reset email"));
      }

    } catch (error) {
      return Promise.reject(error);
    } finally {
      set({ status: AuthStatus.idle });
    }
  },
}));

export const logout = useAuth.getState().signOut;
