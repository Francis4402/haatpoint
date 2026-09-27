// CommentForm.tsx
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  images?: string;
}

interface CommentFormProps {
  productId: string;
  authUser: User | null;
  isAuthenticated: boolean;
  existingReview?: {
    id: string;
    comment?: string | null;
    rating?: number | null;
  } | null;
  onSuccess?: () => void;
  className?: string;
}

export default function CommentForm({
  productId,
  authUser,
  isAuthenticated,
  existingReview,
  onSuccess,
  className = ""
}: CommentFormProps) {
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const getUserInitials = () => {
    if (!authUser?.name) return 'U';
    return authUser.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Generate consistent color for user
  const getUserColor = (userId: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];

    const index = userId % colors.length;
    return colors[index];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to review');
      return;
    }

    if (!comment.trim() && rating === 0) {
      toast.error('Please provide a comment or rating');
      return;
    }

    if (comment.length > 1000) {
      toast.error('Comment must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);

    router.post('/comments', {
      product_id: productId,
      comment: comment.trim() || null,
      rating: rating || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment('');
        setRating(0);
        toast.success(existingReview ? 'Review updated!' : 'Review added successfully!');
        if (onSuccess) {
          onSuccess();
        }
        router.reload({ only: ['comments', 'product'] });
      },
      onError: (errors) => {
        console.error('Review error:', errors);
        toast.error(errors.comment || 'Failed to submit review');
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className={`mb-8 p-4 bg-paper-dim rounded-xl border border-line text-center ${className}`}>
        <p className="text-text-soft">
          Please <a href="/login" className="text-marigold hover:text-marigold-dark hover:underline font-medium">login</a> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`mb-8 ${className}`}>
      <div className="flex space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {authUser?.images ? (
            <img
              src={authUser.images.startsWith('http') ? authUser.images : `/storage/${authUser.images}`}
              alt={authUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-line shadow-hard-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Show initials as fallback
                const parent = target.parentElement;
                if (parent) {
                  const initials = getUserInitials();
                  const color = getUserColor(authUser.id);
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = `w-10 h-10 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-semibold text-sm shadow-hard-sm`;
                  fallbackDiv.textContent = initials;
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          ) : (
            <div className={`w-10 h-10 text-black rounded-full bg-gradient-to-r ${getUserColor(authUser?.id || 1)} flex items-center justify-center text-white font-semibold text-sm shadow-hard-sm`}>
              {getUserInitials()}
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Rating Stars */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-ink mb-1">
              Your Rating {existingReview ? '(optional)' : ''}
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className="w-6 h-6 text-yellow-400 fill-current" />
                  ) : (
                    <FaRegStar className="w-6 h-6 text-gray-300 hover:text-yellow-400 transition-colors" />
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-text-soft">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Comment Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review... (optional)"
            className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft resize-none"
            rows={3}
            maxLength={1000}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-text-soft">
              {comment.length}/1000
            </span>
            <button
              type="submit"
              disabled={isSubmitting || (!comment.trim() && rating === 0)}
              className="px-6 py-2 bg-marigold hover:bg-marigold-dark text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : (
                existingReview ? 'Update Review' : 'Post Review'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
