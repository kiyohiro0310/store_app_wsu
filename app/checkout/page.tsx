"use client";

import Loading from "@/components/fragments/ui/Loading";
import AppLayout from "../AppLayout";
import { useEffect, useState } from "react";
import { useCart } from "@/components/provider/cartItemsProvider";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { User } from "next-auth";
import { getSession } from "next-auth/react";

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const CheckoutContent = () => {
  const { cartItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      if (session?.user?.name) {
        setCardDetails((prev: any) => ({
          ...prev,
          cardholderName: session.user!.name,
        }));
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    }

    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})/, "$1/")
        .substr(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv" && value.length > 4) return;

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder name");
      return false;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }

    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }

    if (!cvv.match(/^[0-9]{3,4}$/)) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    return true;
  };

  async function handleCheckout(orderId: string) {
    if (!validateCardDetails()) return;

    setIsProcessing(true);
    try {
      // Mock payment processing

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to process checkout. Please try again.");
        return;
      }

      const data = await res.json();
      toast.success("Payment successful! Redirecting to order confirmation...");
      setTimeout(() => {
        window.location.href = `/checkout/${orderId}`;
      }, 2000);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Checkout
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Review your order and confirm your purchase.
          </p>
        </header>
        <main className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            {cartItems?.items?.length || 0 ? (
              <ul className="divide-y divide-gray-200">
                {cartItems.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between py-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.productName}
                      </h2>
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={100}
                        height={100}
                      />
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
          {cartItems?.items?.length || 0 ? (
            <>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={cardDetails.cardholderName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Total</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    ${cartItems.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleCheckout(cartItems.items[0].orderId!)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 bg-yellow-400 text-black font-semibold rounded-lg transition ${
                    isProcessing
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-yellow-500"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
};

const CheckoutPage = () => {
  return (
    <AppLayout>
      <CheckoutContent />
    </AppLayout>
  );
};

export default CheckoutPage;
