import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

export function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
      .fromTo(
        headingRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(
        textRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );

  }, []);

  return (
    <section ref={sectionRef} className="bg-yellow-50 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 ref={headingRef} className="text-2xl font-semibold mb-2">
          Stay Updated
        </h3>
        <p ref={textRef} className="mb-4 text-gray-600">
          Subscribe to get updates on new arrivals, discounts, and more.
        </p>
        <div ref={formRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border rounded w-full sm:w-auto focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
