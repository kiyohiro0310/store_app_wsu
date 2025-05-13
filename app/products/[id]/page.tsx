"use client";

import React, { MouseEvent, useEffect, useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import Loading from "@/components/fragments/ui/Loading";
import ErrorPage from "@/components/fragments/ui/Error";
import { useParams } from "next/navigation";
import { StarRating } from "@/components/fragments/ui/StarRating";
import AppLayout from "@/app/AppLayout";
import { formatDate } from "@/functions/date";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/react";
import CircleLoadingIndicator from "@/components/fragments/ui/CircleLoadingIndicator";

const qc = new QueryClient();

const ProductDetailPage = () => {
  const [userEmail, setUserEmail] = useState<string>();
  const [addingCart, setAddingCart] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        } else {
          toast.error("Failed to retrieve user email. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("An error occurred while fetching session data.");
      }
    };

    fetchSession();
  }, []);

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
          toast.error("Failed to fetch product details");
          return;
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

  function addToCartHandler(e: MouseEvent, userEmail?: string) {
    e.preventDefault();

    if (!userEmail) {
      toast.error("Uesr email is not available.");
      return;
    }
    setAddingCart(true);
    fetch("/api/cart/", {
      method: "POST",
      body: JSON.stringify({
        userEmail,
        productId: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to add item to cart.");
        } else {
          setAddingCart(false);
          toast.success(`${product.name} has been added to your cart!`);
          // Delay redirection to allow the toast to display
          setTimeout(() => {
            window.location.href = "/cart"; // Redirect to the cart page
          }, 2000); // 2-second delay
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      });
  }

  return (
    <AppLayout>
      <ToastContainer />
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
            {addingCart ? (
              <button
                className="cursor-pointer w-full px-4 py-2 bg-gray-500 text-white rounded-lg flex justify-center items-center mb-4"
                disabled
              >
                <CircleLoadingIndicator/>
              </button>
            ) : (
              <button
                onClick={(e) => addToCartHandler(e, userEmail)}
                className="cursor-pointer w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition mb-4"
              >
                Add to Cart
              </button>
            )}

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
