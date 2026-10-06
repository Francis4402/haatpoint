import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "sonner";
const RATING_LABELS = {
  1: "Poor",
  2: "Below average",
  3: "Average",
  4: "Good",
  5: "Excellent"
};
const Stars = ({ rating, className = "w-6 h-6" }) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map(
  (star) => star <= rating ? /* @__PURE__ */ jsx(FaStar, { className: `${className} text-yellow-400 fill-current` }, star) : /* @__PURE__ */ jsx(FaRegStar, { className: `${className} text-gray-300` }, star)
) });
function StoreReviewForm({
  storeId,
  storeName,
  isAuthenticated,
  existingReview = null
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e) => {
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
        comment: comment.trim() || null
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Thanks for rating this store!");
          router.reload({
            only: ["store", "storeRating", "userStoreRating"]
          });
        },
        onError: (errors) => {
          toast.error(errors.rating || errors.comment || "Could not save your review");
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      }
    );
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-2", children: "Rate this store" }),
      /* @__PURE__ */ jsxs("p", { className: "text-text-soft text-sm", children: [
        /* @__PURE__ */ jsx("a", { href: "/login", className: "text-marigold hover:text-marigold-dark hover:underline font-medium", children: "Log in" }),
        " ",
        "to rate ",
        storeName,
        " and share your experience with other shoppers."
      ] })
    ] });
  }
  if (existingReview) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: "Your review" }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-[#E7F4EF] text-[#4F6B63] px-3 py-1 text-xs font-medium", children: [
          /* @__PURE__ */ jsx(FaStar, { className: "w-3 h-3 fill-current" }),
          existingReview.rating,
          " — ",
          RATING_LABELS[existingReview.rating]
        ] })
      ] }),
      /* @__PURE__ */ jsx(Stars, { rating: existingReview.rating, className: "w-5 h-5" }),
      existingReview.comment && /* @__PURE__ */ jsx("p", { className: "mt-4 text-text-soft text-sm leading-relaxed border-l-2 border-line pl-4", children: existingReview.comment }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs text-text-soft", children: [
        "You rated ",
        storeName,
        ". Each store can only be rated once per account, so this rating can no longer be changed."
      ] })
    ] });
  }
  const active = hoverRating || rating;
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-2xl shadow-hard-sm border border-line p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-1", children: "Rate this store" }),
    /* @__PURE__ */ jsxs("p", { className: "text-text-soft text-sm mb-5", children: [
      "How would you rate ",
      storeName,
      "? Your review helps other shoppers decide."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-2", children: [
        "Your Rating ",
        /* @__PURE__ */ jsx("span", { className: "text-marigold", children: "*" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setRating(star),
            onMouseEnter: () => setHoverRating(star),
            onMouseLeave: () => setHoverRating(0),
            onFocus: () => setHoverRating(star),
            onBlur: () => setHoverRating(0),
            "aria-label": `Rate ${star} star${star > 1 ? "s" : ""}`,
            "aria-pressed": rating === star,
            className: "focus:outline-none transition-transform hover:scale-110",
            children: star <= active ? /* @__PURE__ */ jsx(FaStar, { className: "w-7 h-7 text-yellow-400 fill-current" }) : /* @__PURE__ */ jsx(FaRegStar, { className: "w-7 h-7 text-gray-300 hover:text-yellow-400 transition-colors" })
          },
          star
        )),
        active > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-3 text-sm text-text-soft", children: [
          active,
          " star",
          active > 1 ? "s" : "",
          " — ",
          RATING_LABELS[active]
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: "store-review-comment", className: "block text-sm font-medium text-ink mb-2", children: [
        "Your Review ",
        /* @__PURE__ */ jsx("span", { className: "text-text-soft font-normal", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "store-review-comment",
          value: comment,
          onChange: (e) => setComment(e.target.value),
          rows: 3,
          maxLength: 1e3,
          placeholder: `Tell others what you think of ${storeName}...`,
          className: "w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft resize-none"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 text-right text-xs text-text-soft", children: [
        comment.length,
        "/1000"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: isSubmitting || rating === 0,
        className: "inline-flex items-center gap-2 px-6 py-2.5 bg-marigold hover:bg-marigold-dark text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
        children: [
          isSubmitting && /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "animate-spin h-4 w-4",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }
                )
              ]
            }
          ),
          isSubmitting ? "Saving..." : "Submit Rating"
        ]
      }
    )
  ] });
}
export {
  StoreReviewForm as default
};
