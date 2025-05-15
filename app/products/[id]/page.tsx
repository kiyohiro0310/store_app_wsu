"use client";

import React, { MouseEvent, useEffect, useState, useRef, useCallback } from "react";
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
import { gsap, useGSAP } from "@/lib/gsap";

const qc = new QueryClient();

const ProductDetailPage = () => {
  const [userEmail, setUserEmail] = useState<string>();
  const [addingCart, setAddingCart] = useState<boolean>(false);
  const productDetailRef = useRef(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  
  // Cleanup function for animations
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  useGSAP(() => {
    // Create a single timeline and store it for cleanup
    const timeline = gsap.timeline({ paused: true });
    animationRef.current = timeline;
    
    // Collect elements to animate
    const productImage = document.querySelector('.product-image');
    const productInfoElements = document.querySelectorAll('.product-info');
    const purchaseSection = document.querySelector('.purchase-section');
    
    if (!productImage || !productInfoElements.length || !purchaseSection) return;
    
    // Set initial state for all elements at once (batch operation)
    gsap.set([productImage, ...productInfoElements, purchaseSection], { 
      opacity: 0,
      y: 20
    });
    
    // Add animations to timeline - more efficient than separate animations
    timeline.to(productImage, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
    timeline.to(productInfoElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05, // Reduced stagger time
      ease: "power2.out"
    }, "-=0.3");
    
    timeline.to(purchaseSection, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");
    
    // Play the timeline
    timeline.play();
    
    // Add hover effects using event delegation for better performance
    const parent = document.querySelector('.purchase-buttons');
    if (parent) {
      parent.addEventListener('mouseenter', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('purchase-btn')) {
          gsap.to(target, {
            scale: 1.03, // Smaller scale for smoother animation
            duration: 0.2,
            overwrite: true
          });
        }
      }, true);
      
      parent.addEventListener('mouseleave', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('purchase-btn')) {
          gsap.to(target, {
            scale: 1,
            duration: 0.2,
            overwrite: true
          });
        }
      }, true);
    }
  }, { scope: productDetailRef });

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
      toast.error("User email is not available.");
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
      <div className="max-w-6xl mx-auto py-12" ref={productDetailRef}>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Product Image Section */}
          <div className="w-full md:w-1/3 product-image will-change-transform">
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
            <h1 className="text-2xl font-bold text-gray-800 product-info will-change-transform">{product.name}</h1>
            <div className="pb-4 product-info will-change-transform">
              <StarRating rating={product.rating} />
              <div>{formatDate(product.releaseDate)}</div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-4 product-info will-change-transform">
              Category:{" "}
              <span className="text-gray-600">{product.category}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 mb-4 product-info will-change-transform">
              Price: <span className="text-green-600">${product.price}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-4 product-info will-change-transform">
              In Stock:{" "}
              <span
                className={`${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-4 product-info will-change-transform">
              Tags:{" "}
              <span className="text-gray-600">{product.tags.join(", ")}</span>
            </p>

            <p className="text-gray-600 mb-4 product-info will-change-transform">{product.description}</p>
          </div>

          {/* Purchase Section */}
          <div className="w-full md:w-1/3 purchase-section will-change-transform">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Price: <span className="text-green-600">${product.price}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {product.inStock
                ? "In Stock. Order now!"
                : "Currently unavailable."}
            </p>
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
                  className="cursor-pointer w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition mb-4 purchase-btn"
                >
                  Add to Cart
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetailPage;
