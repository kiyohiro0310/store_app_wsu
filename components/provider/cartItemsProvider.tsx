"use client";

import { QueryClient, useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import ErrorPage from "../fragments/ui/Error";
import Loading from "../fragments/ui/Loading";
import { Product } from "@/types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: {
    orderId: string;
    price: number;
    items: Product[];
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = new QueryClient();

  const {
    isPending,
    error,
    data: cartItems,
  } = useQuery(
    {
      queryKey: ["products"],
      queryFn: async () => {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          return <ErrorPage />;
        }
        return res.json();
      },
    },
    qc
  );

  if(isPending) return <Loading />

  if(error) return <ErrorPage />

  return (
    <CartContext.Provider value={{ cartItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartItemsProvider");
  }
  return context;
};