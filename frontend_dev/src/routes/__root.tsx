import { Outlet, createRootRouteWithContext, redirect, useLocation, useRouter } from '@tanstack/react-router'
import { AuthStatus, type AuthState } from '@/lib/auth/auth'
import { useAuth } from '@/lib/auth/use-auth';
import { useEffect } from 'react';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { PublicLayout } from '@/components/layout/public-layouts';
import { PrivateLayout } from '@/components/layout/private-layout';
import Welcome from './welcome';

interface MyRouterContext {
  auth: AuthState | undefined;
}

const PUBLIC_ROUTES = ['/welcome', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password',];

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
  beforeLoad: ({ context, location }) => {
    const status = context.auth?.status;

    if (status === AuthStatus.loading || status === undefined) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    const user = JSON.parse(localStorage.getItem("auth_user") || "null") as AuthState['user'];

    if (!user && !isPublicRoute || (user && !user.uid && !isPublicRoute)) {
      throw redirect({ to: '/auth/sign-in', search: { email: "" } });
    }


    if (status === AuthStatus.signIn && isPublicRoute) {
      throw redirect({ to: '/' });
    }
  },
});
const REDIRECT_KEY = 'auth_redirect_to';

const Loader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <ActivityIndicator size="lg" />
  </div>
);

function RootComponent() {
  const { pathname } = useLocation();
  const { hydrate, status } = useAuth();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isPublicRoute) sessionStorage.setItem(REDIRECT_KEY, pathname);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = hydrate();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (status === AuthStatus.loading || status === AuthStatus.idle) return;

    if (status === AuthStatus.signOut && !isPublicRoute) {
      router.navigate({ to: '/auth/sign-in', search: { email: "" }, replace: true });
    } else if (status === AuthStatus.signIn && isPublicRoute) {
      const savedPath = sessionStorage.getItem(REDIRECT_KEY) ?? '/';
      sessionStorage.removeItem(REDIRECT_KEY);
      router.navigate({ to: savedPath, replace: true });
    }
  }, [status]);

  // Affiche le loader si :
  // - auth en cours de résolution
  // - une redirection est imminente

  if (status === AuthStatus.loading || status === AuthStatus.idle) {
    return <Loader />;
  }

  if (status === AuthStatus.signOut) {
    return (
      <>
        <PublicLayout welcome={pathname === '/welcome'}>
          {pathname === '/welcome' ? <Welcome /> : <Outlet />}
        </PublicLayout>
      </>
    );
  }

  return (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
}