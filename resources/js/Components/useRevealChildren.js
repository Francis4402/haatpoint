import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach `ref` to a container; every direct child fades + rises in with a
 * stagger the first time the container scrolls into view.
 * Returns a ref to put on the container element.
 */
export default function useRevealChildren(options = {}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const children = gsap.utils.toArray(ref.current.children);
      if (!children.length) return;

      gsap.set(children, { opacity: 0, y: 26 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
        ...options,
      });
    },
    { scope: ref }
  );

  return ref;
}
