"use client";

import Loading from "@/components/fragments/ui/Loading";
import AppLayout from "../AppLayout";
import { useEffect, useState } from "react";

const CartPage = () => {

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      if (!data || !data.user || data.user.name.toLowerCase() !== "admin") {
        alert("You are not authorized to access this page.");
        window.location.href = "/";
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }

    fetchSession();
  }, []);

  if (isAuthorized === null) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null; // Prevent rendering anything after redirection
  }


  const cartItems = [
    { id: 1, name: "Product 1", price: 29.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 49.99, quantity: 1 },
    { id: 3, name: "Product 3", price: 19.99, quantity: 3 },
  ];

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Your Cart
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Review your selected items and proceed to checkout.
          </p>
        </header>
        <main className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            {cartItems.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-xl font-semibold text-gray-800">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <button className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 cursor-pointer transition">
                Proceed to Checkout
              </button>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
};

export default CartPage;
