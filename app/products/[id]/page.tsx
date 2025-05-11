"use client";

import React from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Loading from "@/components/fragments/ui/Loading";
import ErrorPage from "@/components/fragments/ui/Error";
import { useParams } from "next/navigation";
import { StarRating } from "@/components/fragments/ui/StarRating";
import AppLayout from "@/app/AppLayout";
import { formatDate } from "@/functions/date";

const qc = new QueryClient();
const ProductDetailPage = () => {
  const params = useParams();

  const { id } = params;

  // Fetch product details using TanStack Query
  const {
    data: product,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["product", id],
      queryFn: async () => {
        const res = await fetch(`/api/products/details?id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        return res.json();
      },
      enabled: !!id, // Only fetch if `id` is available
    },
    qc
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return <ErrorPage />;
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Product Image Section */}
          <div className="w-full md:w-1/3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <div className="pb-4">
              <StarRating rating={product.rating} />
              <div>{formatDate(product.releaseDate)}</div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-4">
              Category:{" "}
              <span className="text-gray-600">{product.category}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: <span className="text-green-600">${product.price}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              In Stock:{" "}
              <span
                className={`${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Tags:{" "}
              <span className="text-gray-600">{product.tags.join(", ")}</span>
            </p>

            <p className="text-gray-600 mb-4">{product.description}</p>
          </div>

          {/* Purchase Section */}
          <div className="w-full md:w-1/3">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: <span className="text-green-600">${product.price}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {product.inStock
                ? "In Stock. Order now!"
                : "Currently unavailable."}
            </p>
            <button className="cursor-pointer w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition mb-4">
              Add to Cart
            </button>
            <button className="cursor-pointer w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetailPage;
