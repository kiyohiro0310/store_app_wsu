"use client";
import { useEffect, useState } from "react";
import Products from "@/components/home/Products";
import React from "react";
import { Product } from "@/types";
import AppLayout from "../AppLayout";

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Replace this with your API route
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Our Products
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Browse through our collection of amazing products!
          </p>
        </div>
        <Products items={products} />
      </div>
    </AppLayout>
  );
};

export default page;
