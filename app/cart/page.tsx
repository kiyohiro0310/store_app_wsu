"use client";

import Loading from "@/components/fragments/ui/Loading";
import AppLayout from "../AppLayout";
import { MouseEvent, useEffect, useState, useRef } from "react";
import { useCart } from "@/components/provider/cartItemsProvider";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";

const CartContent = () => {
  const { cartItems } = useCart();
  const cartRef = useRef(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      animationRef.current = tl;

      // Get all elements to animate
      const header = document.querySelector(".cart-header");
      const cartItems = document.querySelectorAll(".cart-item");
      const cartTotal = document.querySelector(".cart-total");
      const checkoutBtn = document.querySelector(".checkout-btn");

      // Early return if elements don't exist
      if (!header) return;

      // Group animations together in a timeline
      tl.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      });

      if (cartItems.length > 0) {
        // Batch set initial state
        gsap.set(cartItems, { opacity: 0, y: 15 });

        // Animate cart items with efficient stagger
        tl.to(
          cartItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: {
              amount: 0.5, // Total stagger time regardless of quantity
              from: "start",
            },
            ease: "power1.out",
          },
          "-=0.2"
        );
      }

      if (cartTotal) {
        gsap.set(cartTotal, { opacity: 0, y: 15 });
        tl.to(
          cartTotal,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.2"
        );
      }

      if (checkoutBtn) {
        gsap.set(checkoutBtn, { opacity: 0, scale: 0.95 });
        tl.to(
          checkoutBtn,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)",
          },
          "-=0.1"
        );
      }

      // Play the timeline
      tl.play();

      // Add hover animations through event delegation
      const removeButtonsContainer = document.querySelector(
        ".cart-items-container"
      );
      if (removeButtonsContainer) {
        removeButtonsContainer.addEventListener(
          "mouseenter",
          (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("remove-btn")) {
              gsap.to(target, {
                scale: 1.05,
                color: "#b91c1c",
                duration: 0.2,
                overwrite: true,
              });
            }
          },
          true
        );

        removeButtonsContainer.addEventListener(
          "mouseleave",
          (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("remove-btn")) {
              gsap.to(target, {
                scale: 1,
                color: "#dc2626",
                duration: 0.2,
                overwrite: true,
              });
            }
          },
          true
        );
      }
    },
    { scope: cartRef, dependencies: [cartItems?.items?.length || 0] }
  );

  async function deleteItemHandler(
    e: MouseEvent,
    orderItemId: string,
    orderItemName: string
  ) {
    e.preventDefault();

    // Get the clicked item's parent element
    const itemElement = (e.currentTarget as HTMLElement).closest(".cart-item");

    if (itemElement) {
      // Use a more optimized animation
      gsap.to(itemElement, {
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => {
          // Use a regular function (not async) to avoid Promise issues
          try {
            fetch("/api/cart", {
              method: "DELETE",
              body: JSON.stringify({ orderItemId }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                if (!res.ok) {
                  toast.error("Failed to remove item from cart.");
                  return;
                }

                toast.success(
                  `${orderItemName} has been removed from your cart.`
                );

                // Shorter delay for better UX
                setTimeout(() => {
                  window.location.href = "/cart";
                }, 800);
              })
              .catch((error) => {
                console.error("Error removing item:", error);
                toast.error("An error occurred while removing the item.");
              });
          } catch (error) {
            console.error("Error removing item:", error);
            toast.error("An error occurred while removing the item.");
          }
        },
      });
    } else {
      // Fallback if animation can't be applied
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          body: JSON.stringify({ orderItemId }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          toast.error("Failed to remove item from cart.");
          return;
        }

        toast.success(`${orderItemName} has been removed from your cart.`);
        setTimeout(() => {
          window.location.href = "/cart";
        }, 800);
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("An error occurred while removing the item.");
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 p-6" ref={cartRef}>
        <header className="mb-8 cart-header opacity-0 translate-y-[-20px] will-change-transform">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Your Cart
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Review your selected items and proceed to checkout.
          </p>
        </header>
        <main className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 cart-items-container">
            {cartItems?.items?.length || 0 ? (
              cartItems.items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {cartItems.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between py-4 cart-item will-change-transform"
                    >
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
                        <button
                          onClick={(e) =>
                            deleteItemHandler(e, item.id, item.productName)
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-semibold remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600">Your cart is empty.</p>
              )
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
          {cartItems?.items?.length || 0
            ? cartItems.items.length > 0 && (
                <div className="border-t border-gray-200 pt-6 cart-total will-change-transform">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Total
                    </h3>
                    <p className="text-xl font-semibold text-gray-800">
                      ${cartItems.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-full flex justify-end items-center">
                    <Link
                      href={"/checkout"}
                      className="bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 cursor-pointer transition checkout-btn will-change-transform"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              )
            : ""}
        </main>
      </div>
    </>
  );
};

const CartPage = () => {
  return (
    <AppLayout>
      <CartContent />
    </AppLayout>
  );
};

export default CartPage;
