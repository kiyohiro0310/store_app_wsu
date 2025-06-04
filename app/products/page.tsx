"use client";
import { useState } from "react";
import Products from "@/components/home/Products";
import React from "react";
import { Filter, Product } from "@/types";
import AppLayout from "../AppLayout";
import ErrorPage from "@/components/fragments/ui/Error";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Loading from "@/components/fragments/ui/Loading";
import ResetButton from "@/components/fragments/ui/ResetButton";

const qc = new QueryClient();

const page = () => {
  const [filter, setFilter] = useState<Filter>({
    category: "",
    tag: "",
    name: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Fetch products using TanStack Query
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();

      // Extract unique categories and tags
      const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category))) as string[];
      const uniqueTags = Array.from(new Set(data.flatMap((p: Product) => p.tags))) as string[];
      setCategories(uniqueCategories);
      setTags(uniqueTags);

      return data;
    },
  }, qc);

  // Filter products based on the selected filters
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !filter.category || product.category === filter.category;
    const matchesTag =
      !filter.tag || product.tags.includes(filter.tag.toLowerCase());
    const matchesName =
      !filter.name ||
      product.name.toLowerCase().includes(filter.name.toLowerCase());

    return matchesCategory && matchesTag && matchesName;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage />;
  }

  // Reset individual filters
  const resetCategory = () => setFilter({ ...filter, category: "" });
  const resetTag = () => setFilter({ ...filter, tag: "" });
  const resetName = () => setFilter({ ...filter, name: "" });

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
        {/* Filter Inputs */}
        <p>Filter:</p>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <select
              data-testid="category-filter"
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ResetButton onClick={resetCategory} />
          </div>

          {/* Tag Dropdown with Reset */}
          <div className="flex items-center space-x-2">
            <select
              data-testid="tag-filter"
              value={filter.tag}
              onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <ResetButton onClick={resetTag} />
          </div>

          {/* Name Search with Reset */}
          <div className="flex items-center space-x-2">
            <input
              data-testid="search-filter"
              type="text"
              placeholder="Search by name..."
              value={filter.name}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <ResetButton onClick={resetName} />
          </div>
        </div>

        {/* Products List */}
        <Products items={filteredProducts} />
      </div>
    </AppLayout>
  );
};

export default page;