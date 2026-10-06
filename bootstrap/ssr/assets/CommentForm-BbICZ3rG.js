import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
function CommentForm({
  productId,
  authUser,
  isAuthenticated,
  existingReview,
  onSuccess,
  className = ""
}) {
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getUserInitials = () => {
    if (!authUser?.name) return "U";
    return authUser.name.split(" ").map((word) => word.charAt(0).toUpperCase()).join("").slice(0, 2);
  };
  const getUserColor = (userId) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
      "from-orange-500 to-orange-600",
      "from-cyan-500 to-cyan-600"
    ];
    const index = userId % colors.length;
    return colors[index];
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to review");
      return;
    }
    if (!comment.trim() && rating === 0) {
      toast.error("Please provide a comment or rating");
      return;
    }
    if (comment.length > 1e3) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }
    setIsSubmitting(true);
    router.post("/comments", {
      product_id: productId,
      comment: comment.trim() || null,
      rating: rating || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment("");
        setRating(0);
        toast.success(existingReview ? "Review updated!" : "Review added successfully!");
        if (onSuccess) {
          onSuccess();
        }
        router.reload({ only: ["comments", "product"] });
      },
      onError: (errors) => {
        console.error("Review error:", errors);
        toast.error(errors.comment || "Failed to submit review");
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx("div", { className: `mb-8 p-4 bg-paper-dim rounded-xl border border-line text-center ${className}`, children: /* @__PURE__ */ jsxs("p", { className: "text-text-soft", children: [
      "Please ",
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-marigold hover:text-marigold-dark hover:underline font-medium", children: "login" }),
      " to leave a review."
    ] }) });
  }
  return /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: `mb-8 ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: authUser?.images ? /* @__PURE__ */ jsx(
      "img",
      {
        src: authUser.images.startsWith("http") ? authUser.images : `/storage/${authUser.images}`,
        alt: authUser.name,
        className: "w-10 h-10 rounded-full object-cover border-2 border-line shadow-hard-sm",
        onError: (e) => {
          const target = e.target;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const initials = getUserInitials();
            const color = getUserColor(authUser.id);
            const fallbackDiv = document.createElement("div");
            fallbackDiv.className = `w-10 h-10 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-semibold text-sm shadow-hard-sm`;
            fallbackDiv.textContent = initials;
            parent.appendChild(fallbackDiv);
          }
        }
      }
    ) : /* @__PURE__ */ jsx("div", { className: `w-10 h-10 text-black rounded-full bg-gradient-to-r ${getUserColor(authUser?.id || 1)} flex items-center justify-center text-white font-semibold text-sm shadow-hard-sm`, children: getUserInitials() }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-ink mb-1", children: [
          "Your Rating ",
          existingReview ? "(optional)" : ""
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
          [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setRating(star),
              onMouseEnter: () => setHoverRating(star),
              onMouseLeave: () => setHoverRating(0),
              className: "focus:outline-none transition-transform hover:scale-110",
              children: star <= (hoverRating || rating) ? /* @__PURE__ */ jsx(FaStar, { className: "w-6 h-6 text-yellow-400 fill-current" }) : /* @__PURE__ */ jsx(FaRegStar, { className: "w-6 h-6 text-gray-300 hover:text-yellow-400 transition-colors" })
            },
            star
          )),
          rating > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-text-soft", children: [
            rating,
            " star",
            rating !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: comment,
          onChange: (e) => setComment(e.target.value),
          placeholder: "Write your review... (optional)",
          className: "w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft resize-none",
          rows: 3,
          maxLength: 1e3
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft", children: [
          comment.length,
          "/1000"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting || !comment.trim() && rating === 0,
            className: "px-6 py-2 bg-marigold hover:bg-marigold-dark text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white inline", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Posting..."
            ] }) : existingReview ? "Update Review" : "Post Review"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  CommentForm as default
};
