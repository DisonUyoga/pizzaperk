import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PropsWithChildren } from "react";

// Create a client
const queryClient = new QueryClient();

export default async function QueryProvider({ children }: any) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
