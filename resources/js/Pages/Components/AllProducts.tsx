import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { CiImageOn } from "react-icons/ci";
import { Product } from '@/types';
import Eyebrow from './Eyebrow';
import ProductCard from '@/Components/ProductCard';


interface allproductsprops {
    product: Product[];
    user: any;
}


const HEADER_VARIANTS = [
    {
        eyebrow: 'Find Your Product',
        heading: 'All Products',
        subtext: "Don't miss out on these exclusive deals!",
    },
    {
        eyebrow: 'Shop the Collection',
        heading: 'Everything In Store',
        subtext: 'Fresh picks, updated all the time.',
    },
    {
        eyebrow: 'Browse & Discover',
        heading: 'Explore Our Range',
        subtext: 'Something for everyone, at every price.',
    },
    {
        eyebrow: 'Handpicked For You',
        heading: 'Top Picks Today',
        subtext: 'Curated favorites from across the store.',
    },
    {
        eyebrow: 'New & Notable',
        heading: 'What We Have',
        subtext: 'Take a look before it sells out.',
    },
];

const AllProducts = ({ product, user }: allproductsprops) => {

    const [headerCopy] = useState(
        () => HEADER_VARIANTS[Math.floor(Math.random() * HEADER_VARIANTS.length)]
    );

    const allproducts = useMemo(() => {
        if (!product || product.length === 0) return [];
        return product.map(item => ({
            ...item,
            rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating) || 0,
        }));
    }, [product]);

    if (!allproducts.length) {
        return (
            <section id="offers">
                <div>
                    <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
                        <div>
                            <Eyebrow>{headerCopy.eyebrow}</Eyebrow>
                            <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">{headerCopy.heading}</h2>
                            <p className="text-gray-500 mt-2">{headerCopy.subtext}</p>
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
                        <Eyebrow>{headerCopy.eyebrow}</Eyebrow>
                        <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">{headerCopy.heading}</h2>
                        <p className="text-gray-500 mt-2">{headerCopy.subtext}</p>
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
                    {allproducts.map((offer) => (
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

export default AllProducts;
