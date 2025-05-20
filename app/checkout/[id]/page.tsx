"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../AppLayout";
import Loading from "@/components/fragments/ui/Loading";
import { fetchUserSession } from "@/components/auth/CheckLogin";
import { useParams } from "next/navigation";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/functions/order";
import ErrorPage from "@/components/fragments/ui/Error";
import Link from "next/link";

const OrderCompletePage = () => {
  const qc = new QueryClient();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { id } = useParams();

  if (!id) {
    return <ErrorPage />;
  }

  const {
    isPending,
    isError,
    data: orderDetails,
  } = useQuery(
    {
      queryKey: ["order", id],
      queryFn: async () =>
        fetch(`/api/checkout?orderId=${id}`).then((res) => res.json()),
    },
    qc
  );

  useEffect(() => {
    fetchUserSession(setIsAuthorized);
  }, []);

  if (isPending) return <Loading />;
  if (isError) return <ErrorPage />;

  if (isAuthorized === null || !isAuthorized || !orderDetails) {
    return <Loading />;
  }

  console.log('Order Details:', orderDetails); // Debug log

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully
              processed.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="mb-4">
              <p className="text-gray-600">Order ID: {orderDetails.id}</p>
              <p className="text-gray-600">Status: {orderDetails.status}</p>
            </div>

            {/* Order Items List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="space-y-4">
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  orderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No items found in this order.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-xl font-semibold">
                ${orderDetails && orderDetails.total ? orderDetails.total.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
            <Link href="/" className="text-yellow-600 hover:text-yellow-800">
                Back to Home
            </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderCompletePage;
