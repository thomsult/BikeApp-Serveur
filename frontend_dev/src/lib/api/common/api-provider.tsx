import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { clientPersister } from "../../storage";
export const queryClient = new QueryClient();

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        persistOptions={{ persister: clientPersister }}
        client={queryClient}
      >
        {children}
      </PersistQueryClientProvider>
    </QueryClientProvider>
  );
};
