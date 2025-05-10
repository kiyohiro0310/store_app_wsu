import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren } from "react";
const qc = new QueryClient();

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>
        <Header />
        {children}
        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppLayout;
