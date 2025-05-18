import { useRef, useEffect } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

export function Benefits() {
    const benefitsRef = useRef(null);
    

    useGSAP(() => {
        // Gather all elements to animate once
        const benefitItems = document.querySelectorAll('.benefit-item');
        
        if (!benefitItems.length) return;
        
        // Create a single timeline for better performance
        const tl = gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: benefitsRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reset", // Reset when scrolled back up
                once: false, // Allow animation to replay
                markers: false // No markers in production
            }
        });
        
        // Batch set initial state
        gsap.set(benefitItems, { opacity: 0, y: 20 });
        
        // Single animation with stagger for better performance
        tl.to(benefitItems, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: {
                amount: 0.4, // Total stagger time
                from: "start"
            },
            ease: "power2.out",
            clearProps: "opacity,transform" // Clear props after animation for better memory management
        });
        
        // Play timeline
        tl.play();
        
        return () => {
            // Clean up
            tl.kill();
        };
    }, { scope: benefitsRef });

    return (
        <section ref={benefitsRef} className="bg-white py-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h3 className="text-2xl font-semibold mb-6">Why Shop With Us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="benefit-item will-change-transform">
                        <h4 className="font-bold text-lg">Free Shipping</h4>
                        <p className="text-sm text-gray-600">On all orders over $50</p>
                    </div>
                    <div className="benefit-item will-change-transform">
                        <h4 className="font-bold text-lg">24/7 Support</h4>
                        <p className="text-sm text-gray-600">Always here to help</p>
                    </div>
                    <div className="benefit-item will-change-transform">
                        <h4 className="font-bold text-lg">Secure Payments</h4>
                        <p className="text-sm text-gray-600">100% secure transactions</p>
                    </div>
                </div>
            </div>
        </section>
    );
}