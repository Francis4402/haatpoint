import { useState } from "react";
import { router } from "@inertiajs/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "sonner";

interface StoreReviewFormProps {
  storeId: string;
  storeName: string;
  isAuthenticated: boolean;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Below average",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const Stars = ({ rating, className = "w-6 h-6" }: { rating: number; className?: string }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) =>
      star <= rating ? (
        <FaStar key={star} className={`${className} text-yellow-400 fill-current`} />
      ) : (
        <FaRegStar key={star} className={`${className} text-gray-300`} />
      )
    )}
  </div>
);

export default function StoreReviewForm({
  storeId,
  storeName,
  isAuthenticated,
  existingReview = null,
}: StoreReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to rate this store");
      return;
    }

    if (rating === 0) {
      toast.error("Please pick a star rating");
      return;
    }

    if (comment.trim().length > 0 && comment.trim().length < 3) {
      toast.error("Your review must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);

    router.post(
      `/stores/${storeId}/review`,
      {
        rating,
        comment: comment.trim() || null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Thanks for rating this store!");
          // The average and the count both live on the refreshed props, so the
          // header, the stats block and the structured data all move together.
          router.reload({
            only: ["store", "storeRating", "userStoreRating"],
          });
        },
        onError: (errors) => {
          toast.error(errors.rating || errors.comment || "Could not save your review");
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  // Signed out: point at the login page rather than showing a dead form.
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
        <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-2">
          Rate this store
        </h3>
        <p className="text-text-soft text-sm">
          <a href="/login" className="text-marigold hover:text-marigold-dark hover:underline font-medium">
            Log in
          </a>{" "}
          to rate {storeName} and share your experience with other shoppers.
        </p>
      </div>
    );
  }

  // Already rated. The rating is final, so this is a read-only summary rather
  // than a form the reader might try to resubmit.
  if (existingReview) {
    return (
      <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">
            Your review
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F4EF] text-[#4F6B63] px-3 py-1 text-xs font-medium">
            <FaStar className="w-3 h-3 fill-current" />
            {existingReview.rating} &mdash; {RATING_LABELS[existingReview.rating]}
          </span>
        </div>

        <Stars rating={existingReview.rating} className="w-5 h-5" />

        {existingReview.comment && (
          <p className="mt-4 text-text-soft text-sm leading-relaxed border-l-2 border-line pl-4">
            {existingReview.comment}
          </p>
        )}

        <p className="mt-4 text-xs text-text-soft">
          You rated {storeName}. Each store can only be rated once per account, so this rating can no
          longer be changed.
        </p>
      </div>
    );
  }

  const active = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
      <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-1">
        Rate this store
      </h3>
      <p className="text-text-soft text-sm mb-5">
        How would you rate {storeName}? Your review helps other shoppers decide.
      </p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-ink mb-2">
          Your Rating <span className="text-marigold">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onFocus={() => setHoverRating(star)}
              onBlur={() => setHoverRating(0)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={rating === star}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              {star <= active ? (
                <FaStar className="w-7 h-7 text-yellow-400 fill-current" />
              ) : (
                <FaRegStar className="w-7 h-7 text-gray-300 hover:text-yellow-400 transition-colors" />
              )}
            </button>
          ))}
          {active > 0 && (
            <span className="ml-3 text-sm text-text-soft">
              {active} star{active > 1 ? "s" : ""} &mdash; {RATING_LABELS[active]}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="store-review-comment" className="block text-sm font-medium text-ink mb-2">
          Your Review <span className="text-text-soft font-normal">(optional)</span>
        </label>
        <textarea
          id="store-review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={`Tell others what you think of ${storeName}...`}
          className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft resize-none"
        />
        <div className="mt-1 text-right text-xs text-text-soft">{comment.length}/1000</div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-marigold hover:bg-marigold-dark text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isSubmitting && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isSubmitting ? "Saving..." : "Submit Rating"}
      </button>
    </form>
  );
}
