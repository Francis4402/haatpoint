import { Product } from "@/types";
import ProductCard from "@/Components/ProductCard";
import ProductShowcase from "./ProductShowcase";

interface OfferedProductsProps {
  product: Product[];
  user: any;
}

const OfferedProducts = ({ product, user }: OfferedProductsProps) => {
  const products: Product[] = (product ?? []).map((item) => ({
    ...item,
    rating: typeof item.rating === "string" ? parseFloat(item.rating) : Number(item.rating) || 0,
  }));

  return (
    <ProductShowcase
      id="offers"
      eyebrow="Hand-picked for you"
      title="Products on offer"
      description="A rotating selection of deals, refreshed on every visit."
      items={products}
      renderItem={(item) => <ProductCard product={item} user={user} variant="featured" />}
    />
  );
};

export default OfferedProducts;
