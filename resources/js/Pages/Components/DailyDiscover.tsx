import { Product } from "@/types";
import ProductCard from "@/Components/ProductCard";
import ProductShowcase from "./ProductShowcase";

interface DailyDiscoverProps {
  discoverProduct: (Product & { reviews_count?: number; rating?: number })[];
  user: any;
}

const DailyDiscover = ({ discoverProduct, user }: DailyDiscoverProps) => {
  const products: Product[] = (discoverProduct ?? []).map((item) => ({
    ...item,
    rating: typeof item.rating === "string" ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  return (
    <ProductShowcase
      id="daily-discover"
      eyebrow="Shuffled on every visit"
      title="Discover something new"
      description="Six random picks from across the marketplace, different each time."
      items={products}
      renderItem={(item) => <ProductCard product={item} user={user} />}
    />
  );
};

export default DailyDiscover;
