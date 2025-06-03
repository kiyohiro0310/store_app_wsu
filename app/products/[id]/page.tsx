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
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [addingCart, setAddingCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams();
  const id = params?.id as string;


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("An error occurred while fetching session data.");
      }
    };

    fetchSession();
  }, []);

  // Fetch product details using TanStack Query
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/products/details?id=${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error("Failed to fetch product details");
        throw error;
      }
    },
    enabled: Boolean(id), // Only fetch if `id` is available
    retry: 1,
  }, qc);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return <ErrorPage />;
  }

  async function addToCartHandler(e: MouseEvent, userEmail?: string) {
    e.preventDefault();

    if (!userEmail) {
      toast.error("Please sign in to add items to your cart");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (quantity > product.quantity) {
      toast.error("Selected quantity exceeds available stock");
      return;
    }
    
    setAddingCart(true);
    
    try {
      const res = await fetch("/api/cart/", {
        method: "POST",
        body: JSON.stringify({
          userEmail,
          productId: id,
          quantity,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }
      
      toast.success(`${product.name} has been added to your cart!`);
      
      // Delay redirection to allow the toast to display
      setTimeout(() => {
        window.location.href = "/cart"; // Redirect to the cart page
      }, 2000); // 2-second delay
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("An error occurred while adding to cart. Please try again.");
    } finally {
      setAddingCart(false);
    }
  }

  return (
    <AppLayout>
      <ToastContainer />
      <div data-testid="product-detail" className="max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Product Image Section */}
          <div className="w-full md:w-1/3">
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="eager" // Load product image eagerly
              className="w-full h-auto object-cover rounded-lg"
              width="400"
              height="400"
            />
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <div className="pb-4">
              <StarRating rating={product.rating || 0} />
              <div>{product.releaseDate ? formatDate(product.releaseDate) : "No release date"}</div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-4">
              Category:{" "}
              <span className="text-gray-600">{product.category || "Uncategorized"}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: <span className="text-green-600">${product.price?.toFixed(2) || "0.00"}</span>
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
              <span className="text-gray-600">{product.tags?.join(", ") || "None"}</span>
            </p>

            <p className="text-gray-600 mb-4">{product.description || "No description available"}</p>
          </div>

          {/* Purchase Section */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Price: <span className="text-green-600">${product.price?.toFixed(2) || "0.00"}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {product.inStock
                  ? `In Stock (${product.quantity} available)`
                  : "Currently unavailable."}
              </p>
              {product.inStock && (
                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min={1}
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                      className="w-20 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="purchase-buttons">
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
                    className="cursor-pointer w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!product.inStock}
                  >
                    {userEmail ? "Add to Cart" : "Sign in to Purchase"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetailPage;
