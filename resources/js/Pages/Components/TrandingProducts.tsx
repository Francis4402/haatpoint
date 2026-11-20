import { Product } from "@/types";
import ProductCard from "@/Components/ProductCard";
import ProductShowcase from "./ProductShowcase";

interface TrendingProductsProps {
  trendingProducts?: Product[];
  trandingproduct?: Product[];
  user: any;
}

const TrendingProducts = ({ trendingProducts, trandingproduct, user }: TrendingProductsProps) => {
  const sourceProducts = trendingProducts ?? trandingproduct ?? [];
  const products: Product[] = sourceProducts.map((item) => ({
    ...item,
    rating: typeof item.rating === "string" ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  return (
    <ProductShowcase
      id="trending"
      eyebrow="Popular right now"
      title="Trending products"
      description="What other shoppers are browsing at the moment."
      items={products}
      renderItem={(item) => <ProductCard product={item} user={user} variant="trending" />}
    />
  );
};

export default TrendingProducts;
