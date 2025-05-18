import { useRef, useEffect } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";


export function CTABanner() {
gsap.registerPlugin(useGSAP);

  const bannerRef = useRef(null);

  useGSAP(() => {
    // Create a single timeline for all animations to reduce DOM operations
    const tl = gsap.timeline({
      paused: true, // Start paused for better performance
      scrollTrigger: {
        trigger: ".cta-banner",
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reset", // Reset when scrolling back up
        once: false, // Allow animation to replay if scrolled back
        markers: false // Keep markers off in production
      }
    });
    
    // Batch animate elements for better performance
    const elements = [
      ".cta-title",
      ".cta-desc",
      ".cta-button"
    ];
    
    // Initial opacity set (batch operation)
    gsap.set(elements, { opacity: 0, y: 20 });
    
    // Add animations to timeline with proper staggering
    tl.to(".cta-banner", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    })
    .to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.2");
    
    // Play the timeline
    tl.play();
    
    // Add button hover effect with better performance
    const button = document.querySelector('.cta-button');
    if (button) {
      // Use simpler hover effect to reduce performance cost
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          overwrite: true
        });
      });
      
      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          overwrite: true
        });
      });
    }
    
    // Return cleanup function
    return () => {
      tl.kill();
    };
  }, { scope: bannerRef });

  return (
    <div className="cta-banner">

    <section ref={bannerRef} className="bg-black text-white py-12 text-center will-change-transform">
      <h3 className="text-3xl font-bold mb-4 cta-title will-change-transform">Ready to Upgrade Your Tech?</h3>
      <p className="mb-6 cta-desc will-change-transform">
        Explore our best-selling gadgets and enjoy free shipping today.
      </p>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded text-lg font-medium cta-button will-change-transform">
        Browse Products
      </button>
    </section>
    </div>

  );
}
