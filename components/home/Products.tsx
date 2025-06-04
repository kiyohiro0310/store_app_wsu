"use client";

import React, { Dispatch, useRef, useEffect, useMemo } from "react";
import { StarRating } from "../fragments/ui/StarRating";
import { Product } from "@/types";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";

const Products = ({
  items,
}: {
  items: Product[];
}) => {
  const productsRef = useRef(null);

  useGSAP(() => {
    // Use a single batch animation for better performance
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length === 0) return;
    
    // Group animations in a timeline for better performance
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: ".products-grid",
        start: "top 90%", // Start earlier for better perceived performance
        end: "bottom 15%",
        toggleActions: "play none none reset" // Reset animations when scrolled back up
      }
    });
    
    // Batch animate all cards at once with stagger
    tl.fromTo(productCards, 
      { 
        y: 30, // Reduced movement for better performance
        opacity: 0,
        scale: 0.97 // Smaller scale change for smoother animation
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4, // Faster animation
        stagger: {
          amount: 0.5, // Total stagger time regardless of quantity
          from: "start",
          grid: "auto"
        }
      }
    );
    
    // Auto-play the timeline
    tl.play();
    
    return () => {
      // Clean up by killing the timeline
      tl.kill();
    };
  }, { scope: productsRef, dependencies: [items] });

  if (!items || items.length === 0) {
    return <div>No items found</div>;
  }
  
  return (
    <div className="bg-gray-50 p-6" ref={productsRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 products-grid">
        {items.map((product) => (
          <Link
          data-testid="product"
            href={`/products/${product.id}`}
            key={product.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform product-card will-change-transform"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy" // Add lazy loading for images
              width="300"
              height="200"
              className="h-48 w-full object-cover product-image"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 product-title">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 mb-1 product-category">{product.category}</p>
              <p className="text-sm text-gray-700 mb-3 h-16 product-desc">
                {product.description.length > 100 
                  ? `${product.description.substring(0, 100)}...` 
                  : product.description}
              </p>
              <div className="flex justify-between items-center product-price-rating">
                <span className="text-xl font-bold">
                  {product.currency} {product.price.toFixed(2)}
                </span>
                {product.rating && <StarRating rating={product.rating} />}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 product-tags">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
