import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren } from "react";
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch on window focus to ensure session is current
      refetchWhenOffline={false} // Don't refetch when offline
    >
      <QueryClientProvider client={qc}>
        <Header />
        {children}
        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppLayout;
