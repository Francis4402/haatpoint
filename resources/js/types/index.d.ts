export interface ProductFilters {
    category: string;
    product_type: string;
    search: string;
    sort_by: string;
}

export interface User {
    id: number;
    name: string;
    images: string;
    email: string;
    role: 'superadmin'| 'admin' | 'agent' | 'deliveryman' | 'user';
    email_verified_at: string;
    created_at?: string;
    /**
     * Only exist on an agent session: the KYC columns live on `agents`, and
     * HandleInertiaRequests shares the signed-in model as-is.
     */
    mobile?: string | null;
    national_id?: string | null;
    address?: string | null;
}

export type CartItem = {
    id: string;
    user_id: string;
    store_id: string;
    name: string;
    images: string;
    slug: string;
    category: string;
    subcategory: string;
    quantity: number;
    regular_price: number;
    sale_price: number;
    description: string;
    color: string;
    size: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    item_weight: number;
    store?: storeType;
    review?: number;
    cartQty?: number;
    /** Chosen variant for this cart line (parsed from the selectors). */
    selectedSize?: string;
    selectedColor?: string;
    /** Stable identity for a product + variant combination inside the cart. */
    cartKey?: string;
    created_at: string;
    updated_at: string;
}


export interface storeType {
    id: string;
    name: string;
    email: string;
    logo: string;
    storetype: string;
    license: string;
    address: string;
    mobile: string;
    rating: number;
    review_count: string;
    national_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface categoryType {
    id: string;
    categories: string;
    brand: string;
    subcategory: string | null;
    sizes?: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    user_id: string;
    store_id: string;
    name: string;
    images: string;
    slug: string;
    category: string;
    subcategory: string;
    brand: string;
    quantity: number;
    regular_price: number;
    sale_price: number;
    description: string;
    color: string;
    size: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    item_weight: number;
    store?: storeType;
    created_at: string;
    updated_at: string;
}

export interface Orders {
    id: string;
    store_id: string;
    user_id: string | null;
    agent_id?: string | null;
    merchant_order_id: string;
    sender_name: string;
    sender_email: string;
    sender_phone: string;
    recipient_name: string;
    recipient_email: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_city: number;
    recipient_zone: number;
    recipient_area: number;
    delivery_type: number;
    item_type: number;
    special_instruction?: string;
    item_quantity: number;
    item_weight: number;
    amount_to_collect: number;
    item_description: string;
    store_name: string;
    order_number: string;
    subtotal: number;
    delivery_charge: number;
    total: number;
    coupon_code: string;
    discount_amount: number;
    tracking_number: string;
    shipping_method: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    notes: string;
    items: string;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  total: number;
  weight?: number;
  size?: string | null;
  color?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface citytypes {
    city_id: number;
    city_name: string;
}

export interface zonetypes {
    zone_id: number;
    zone_name: string;
}

export interface areatypes {
    area_id: number;
    area_name: string;
    home_delivery_available: boolean;
    pickup_available: boolean;
}

export interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageOrderValue: number;
  recentOrders: Orders[];
}

export interface Comments {
    id: string;
    user_id: string;
    product_id: string;
    store_id: string;
    comment: string | null;
    rating: number | null;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface ReviewType {
    product_id: string;
    store_id: string;
    user_id: string;
}


export interface CustomerType {
  id: string;
  name: string;
  email: string;
  images: string | null;
  role: 'superadmin' | 'admin' | 'agent' | 'deliveryman' | 'user';
  email_verified_at: string | null;
  blocked?: boolean;
  created_at: string;
  updated_at: string;

  profile?: {
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    date_of_birth: string | null;
  };

  stats?: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: string | null;
    ordersThisMonth: number;
  };
}
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        /** False when the signed-in account still has to confirm its address. */
        requiresVerification?: boolean;
        isVerified?: boolean;
        incompleteVendorProfile?: boolean;
        missingVendorProfileFields?: string[];
    };
    /** Shared by HandleInertiaRequests so redirect()->back()->with() is visible. */
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};
