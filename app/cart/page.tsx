"use client";

import Loading from "@/components/fragments/ui/Loading";
import AppLayout from "../AppLayout";
import { useEffect, useState } from "react";
import { fetchUserSession } from "@/components/auth/CheckLogin";
import { useCart } from "@/components/provider/cartItemsProvider";
import Image from "next/image";

const CartPage = () => {
  const { cartItems} = useCart() as any;
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);


  useEffect(() => {
    fetchUserSession(setIsAuthorized);
  }, []);

  if (isAuthorized === null || !isAuthorized) {
    return <Loading />;
  }

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
            {cartItems.items.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {cartItems.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.productName}
                      </h2>
                      <Image src={item.productImage} alt={item.productName} width={100} height={100}/>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
          {cartItems.items.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                <p className="text-xl font-semibold text-gray-800">
                  ${cartItems.price}
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
