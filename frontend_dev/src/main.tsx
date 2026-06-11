import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './lib/theme/theme-context'
import { LanguageProvider } from './lib/i18n/language-context'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ApiProvider } from './lib/api/common'
import { Toaster } from 'sonner';
import { useAuth } from './lib/auth/use-auth'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTrackingSync } from './lib/map/use-tracking-user'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined, // Will be set in RootComponent using useAuth()
  },
})
// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const RouterContextProvider = () => {
  useTrackingSync();

  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_PUBLIC_GOOGLE_WEB_CLIENT_ID}>
      <ApiProvider>
        <LanguageProvider>
          <RouterContextProvider />
          <Toaster />
        </LanguageProvider>
      </ApiProvider>
    </GoogleOAuthProvider>
  </ThemeProvider>
  // </StrictMode>
)

