import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loading = () => {
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.to(dotsRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div data-testid="loading" className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center space-x-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) dotsRef.current[index] = el;
            }}
            className="w-4 h-4 bg-yellow-500 rounded-full"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
