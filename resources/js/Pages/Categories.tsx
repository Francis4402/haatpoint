import { useState, useMemo } from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { FiSearch, FiGrid, FiArrowRight } from 'react-icons/fi';
import SeoHead from '@/Components/SeoHead';

interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    subcategories: string[];
    brands: string[];
}

interface CategoriesPageProps extends PageProps {
    categories: CategoryItem[];
    wishlist: any;
}

export default function CategoriesPage({ auth, categories = [], wishlist }: CategoriesPageProps) {
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => {
        if (!search.trim()) return categories;
        const q = search.toLowerCase();
        return categories.filter(c => 
            c.name.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.subcategories?.some(s => s.toLowerCase().includes(q))
        );
    }, [categories, search]);

    return (
        <AppLayout user={auth.user} wishlist={wishlist}>
            <SeoHead
                title="Explore All Categories - Online Shopping BD | HaatPoint"
                description="Browse all 24 product categories at HaatPoint: Men's Fashion, Women's Clothing, Electronics, Gadgets, Home Essentials, Beauty, and more with cash on delivery across Bangladesh."
                keywords="online categories, shopping departments bangladesh, fashion bd, electronics gadgets bd, home goods, beauty care bd, online shopping bangladesh, ক্যাটাগরি, হাটপয়েন্ট"
            />

            <div className="bg-[#FAF9F6] border-b border-[#E3E1DB] py-12 md:py-16">
                <div className="container max-w-5xl mx-auto text-center px-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                        <FiGrid className="w-3.5 h-3.5" />
                        <span>Curated Marketplace Directory</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1B] tracking-tight mb-4">
                        Explore All Categories
                    </h1>
                    <p className="text-sm sm:text-base text-[#767470] max-w-2xl mx-auto mb-8">
                        Discover top deals across 24 curated departments. Handpicked quality products directly sourced from verified manufacturers.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories or subcategories..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E3E1DB] rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                    </div>
                </div>
            </div>

            <div className="container py-12 px-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-sm text-muted-foreground font-medium">
                        Showing <span className="font-semibold text-foreground">{filteredCategories.length}</span> categories
                    </p>
                    <Link
                        href={route('products.index')}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        <span>View All Products</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {filteredCategories.map((cat) => (
                        <div
                            key={cat.id || cat.slug}
                            className="group bg-white rounded-2xl border border-[#E3E1DB] p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted/20 mb-4 relative">
                                    <img
                                        src={`/storage/${cat.image}`}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/logo.png';
                                        }}
                                    />
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                    {cat.description}
                                </p>
                            </div>

                            <div>
                                {cat.subcategories && cat.subcategories.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {cat.subcategories.slice(0, 3).map((sub) => (
                                            <Link
                                                key={sub}
                                                href={`/products?category=${encodeURIComponent(cat.name)}`}
                                                className="text-[11px] bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-md transition-colors"
                                            >
                                                {sub}
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {cat.brands && cat.brands.length > 0 && (
                                    <div className="mb-4 pt-2 border-t border-[#E3E1DB]/60">
                                        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                                            Brands:
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {cat.brands.slice(0, 4).map((brand) => (
                                                <Link
                                                    key={brand}
                                                    href={`/products?category=${encodeURIComponent(cat.name)}&brand=${encodeURIComponent(brand)}`}
                                                    className="text-[10.5px] font-medium text-ink bg-muted/50 hover:bg-primary/10 hover:text-primary px-2 py-0.5 rounded transition-colors"
                                                >
                                                    {brand}
                                                </Link>
                                            ))}
                                            {cat.brands.length > 4 && (
                                                <span className="text-[10px] text-muted-foreground self-center">
                                                    +{cat.brands.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold transition-colors"
                                >
                                    <span>Browse Products</span>
                                    <FiArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
