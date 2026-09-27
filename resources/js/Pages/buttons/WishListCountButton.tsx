// WishlistButton.tsx - Simplified version
import { Link } from "@inertiajs/react";
import { FiHeart } from "react-icons/fi";
import { useState, useEffect } from "react";

interface WishlistButtonProps {
  wishlist: {
    total: number;
    data?: any[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
  };
  className?: string;
}

const WishlistCountButton = ({ wishlist, className = "" }: WishlistButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get count directly from total property
  const wishlistCount = wishlist?.total || 0;

  // Animate when count changes
  useEffect(() => {
    if (wishlistCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wishlistCount]);

  return (
    <Link
      href="/wishlist"
      className={`relative p-2 rounded-md transition-all duration-200 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <FiHeart className={`h-5 w-5 transition-all duration-300 ${
          isHovered ? 'scale-110 text-red-500' : wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''
        }`} />

        {/* Wishlist Count Badge */}
        {wishlistCount > 0 && (
          <>
            <div className={`absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg transform transition-all duration-300 ${
              isAnimating ? 'animate-bounce scale-110' : ''
            }`}>
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </div>

            {/* Pulse Effect */}
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
          </>
        )}

        {/* Empty State Dot - Shows when count is 0 */}
        {wishlistCount === 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300"></span>
        )}
      </div>

      {/* Tooltip on Hover */}
      {isHovered && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
          {wishlistCount === 0 ? 'Wishlist is empty' : `${wishlistCount} item${wishlistCount > 1 ? 's' : ''} in wishlist`}
        </div>
      )}
    </Link>
  );
};

export default WishlistCountButton;
