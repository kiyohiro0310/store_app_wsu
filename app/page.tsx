"use client";
import {
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { Benefits } from "@/components/home/Benefits";
import { CTABanner } from "@/components/home/CTABanner";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import Products from "@/components/home/Products";
import { Product } from "@/types";
import Loading from "@/components/fragments/ui/Loading";
import AppLayout from "./AppLayout";
import ErrorPage from "@/components/fragments/ui/Error";

const qc = new QueryClient();
export default function Home() {
  const {
    isPending,
    error,
    data: products,
  } = useQuery(
    {
      queryKey: ["products"],
      queryFn: async () => {
        const res = await fetch("/api/products");
        if (!res.ok) {
          return <ErrorPage />;
        }
        return res.json();
      },
    },
    qc
  );

  if (isPending) {
    return <Loading />;
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <AppLayout>
      <Hero />
      <Products items={products as Product[]} />
      <Benefits />
      <Newsletter />
      <CTABanner />
    </AppLayout>
  );
}
