import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all needed plugins immediately
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Configure GSAP defaults for better performance
gsap.defaults({
  ease: "power2.out",
  duration: 0.5, // Shorter default duration
  overwrite: "auto" // Helps prevent animation conflicts
});

export { gsap, useGSAP, ScrollTrigger }; 