import { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Benefits() {
    const benefitsRef = useRef(null);
    

    useGSAP(() => {
        // Gather all elements to animate once
        const benefitItems = document.querySelectorAll('.benefit-item');
        
        if (!benefitItems.length) return;
        
        
        // Batch set initial state
        gsap.set(benefitItems, { opacity: 0, y: 20 });
        
        // Play timeline
    }, { scope: benefitsRef });

    return (
        <section ref={benefitsRef} className="bg-white py-12 benefits-section">
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