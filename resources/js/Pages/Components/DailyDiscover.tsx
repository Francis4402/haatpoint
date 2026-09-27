// DailyDiscover.tsx
import { Product } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import Eyebrow from "./Eyebrow";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/Components/ProductCard";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface DailyDiscoverProduct {
  discoverProduct: (Product & {
    reviews_count?: number;
    rating?: number;
  })[];
  user: any;
}

const DailyDiscover = ({ discoverProduct, user }: DailyDiscoverProduct) => {
  const [isMounted, setIsMounted] = useState(false);
  const scope = useRef<HTMLElement>(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    // Refresh ScrollTrigger after mount
    ScrollTrigger.refresh();
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // GSAP animation with proper cleanup
  useGSAP(
    () => {
      if (!isMounted) return;

      const cards = gsap.utils.toArray(".discover-card");

      // Only run animation if there are cards
      if (cards.length === 0) return;

      // Set initial state
      gsap.set(cards, { opacity: 0, y: 40 });

      // Animate with ScrollTrigger
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 85%",
          once: true,
          id: "dailyDiscoverAnimation",
          invalidateOnRefresh: true,
        },
        clearProps: "all",
      });
    },
    {
      scope,
      dependencies: [isMounted, discoverProduct]
    }
  );

  // Refresh ScrollTrigger when products change
  useEffect(() => {
    if (isMounted && discoverProduct.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMounted, discoverProduct]);

  if (!discoverProduct || discoverProduct.length === 0) return null;

  return (
    <section id="daily-discover" ref={scope}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <Eyebrow>Discover new favorites</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Daily Discover</h2>
            <p className="text-text-soft text-sm mt-2 max-w-2xl">
              Explore products our customers are loving today
            </p>
          </div>
          <Link
            href={route('products.index')}
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {discoverProduct.map((product) => (
            <div key={product.id} className="discover-card">
              <ProductCard
                product={product}
                variant="default"
                showQuickView={true}
                user={user}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-marigold text-white rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All Products
            <FaArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-text-soft mt-4">
            Showing {discoverProduct.length} daily discover products
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyDiscover;
