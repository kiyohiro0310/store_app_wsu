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

            <div className="mt-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-xl font-semibold">
                ${orderDetails.total.toFixed(2)}
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
