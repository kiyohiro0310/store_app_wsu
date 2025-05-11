import AppLayout from "@/app/AppLayout";
import React from "react";

const ErrorPage = () => {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-6">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 text-center mb-4">
            We encountered an error while processing your request. Please try
            again later.
          </p>

        </div>
      </div>
    </AppLayout>
  );
};

export default ErrorPage;
