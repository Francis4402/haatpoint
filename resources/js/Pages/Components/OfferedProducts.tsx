
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { CiImageOn } from "react-icons/ci";
import { Product } from '@/types';
import Eyebrow from './Eyebrow';
import ProductCard from '@/Components/ProductCard';

interface OfferedProductsProps {
    product: Product[];
    user: any;

}

const OfferedProducts = ({ product, user }: OfferedProductsProps) => {
    const [parsedProducts, setParsedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (product && product.length > 0) {
            const parsed = product.map(item => ({
                ...item,
                rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0
            }));
            setParsedProducts(parsed);
        }
    }, [product]);

    if (!parsedProducts.length) {
        return (
            <section id="offers">
                <div>
                    <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
                        <div>
                            <Eyebrow>Exclusive Deals</Eyebrow>
                            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Special Offers</h2>
                        </div>
                    </div>
                    <div className="text-center py-12">
                        <CiImageOn className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No products available</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="" id="offers">
            <div>
                {/* Header */}
                <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
                    <div>
                        <Eyebrow>Exclusive Deals</Eyebrow>
                        <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Special Offers</h2>
                        <p className="text-gray-500 mt-2">Don't miss out on these exclusive deals!</p>
                    </div>
                    <Link
                        href={route('products.index')}
                        className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:text-primary transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {parsedProducts.map((offer) => (
                        <ProductCard
                            key={offer.id}
                            product={offer}
                            badge={offer.sale_price && offer.sale_price < offer.regular_price ? 'Sale' : undefined}
                            variant="default"
                            showQuickView={true}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OfferedProducts;
