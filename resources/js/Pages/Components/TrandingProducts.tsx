
import { Link } from "@inertiajs/react";
import { FiZap } from "react-icons/fi";
import Eyebrow from "./Eyebrow";
import { Product } from "@/types";
import useRevealChildren from "@/Components/useRevealChildren";
import ProductCard from "@/Components/ProductCard";


interface TrendingProductsProps {
    trandingproduct: Product[];
    user: any;
}

const TrendingProducts = ({ trandingproduct, user }: TrendingProductsProps) => {
  const ref = useRevealChildren();

  // Parse products
  const parsedProducts: Product[] = (trandingproduct ?? []).map(item => ({
    ...item,
    rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  if (!parsedProducts.length) {
    return (
      <section className="py-20 bg-paper-dim" id="trending">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="text-center py-12">
            <FiZap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No trending products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trending">
      <div>
        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <Eyebrow>Moving fast this week</Eyebrow>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Trending products</h2>
          </div>
          <Link
            href={route('products.index')}
            className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Products Horizontal Scroll */}
        <div ref={ref} className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {parsedProducts.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
                variant="trending"
                showQuickView={true}
                user={user}
              />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
