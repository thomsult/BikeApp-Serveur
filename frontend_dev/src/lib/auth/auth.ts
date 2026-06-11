import { onAuthStateChanged, type UserCredential } from "firebase/auth";
type User = UserCredential['user'] | null;

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  signIn: (data: User) => Promise<User | null>;
  signOut: (options?: { clear?: boolean }) => Promise<void>;
  forgetPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (data: { password: string; code: string }) => Promise<void>;
  hydrate: () => ReturnType<typeof onAuthStateChanged>;
}

export const AuthStatus = {
  idle: "idle",
  loading: "loading",
  signIn: "signIn",
  signOut: "signOut",
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];


export type TokenType = string;
