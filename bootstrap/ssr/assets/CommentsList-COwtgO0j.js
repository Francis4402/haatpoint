import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { FaUser, FaClock, FaStar, FaRegStar, FaTimes, FaCheck, FaEdit, FaTrash, FaExclamation } from "react-icons/fa";
import { useState, Fragment as Fragment$1 } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Transition, Dialog } from "@headlessui/react";
import CommentForm from "./CommentForm-BbICZ3rG.js";
function CommentsList({
  comments,
  productId,
  authUser,
  isAuthenticated,
  userReview,
  onCommentAdded
}) {
  const [imageErrors, setImageErrors] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleImageError = (commentId) => {
    setImageErrors((prev) => ({ ...prev, [commentId]: true }));
  };
  const getUserInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
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
      "from-teal-500 to-teal-600"
    ];
    const index = parseInt(userId) % colors.length;
    return colors[index];
  };
  const renderRatingStars = (rating, size = "sm") => {
    if (!rating) return null;
    const starClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx("span", { children: star <= rating ? /* @__PURE__ */ jsx(FaStar, { className: `${starClass} text-yellow-400 fill-current` }) : /* @__PURE__ */ jsx(FaRegStar, { className: `${starClass} text-gray-300` }) }, star)) });
  };
  const openDeleteDialog = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCommentToDelete(null);
  };
  const handleDelete = () => {
    if (!commentToDelete) return;
    setIsSubmitting((prev) => ({ ...prev, [commentToDelete]: true }));
    router.delete(`/comments/${commentToDelete}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Review deleted successfully!");
        closeDeleteDialog();
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: (errors) => {
        console.error("Delete error:", errors);
        toast.error(errors.message || "Failed to delete review");
        closeDeleteDialog();
      },
      onFinish: () => {
        setIsSubmitting((prev) => ({ ...prev, [commentToDelete || ""]: false }));
      }
    });
  };
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment || "");
    setEditRating(comment.rating || 0);
  };
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
    setEditRating(0);
  };
  const handleUpdate = (commentId) => {
    if (!editText.trim() && editRating === 0) {
      toast.error("Please provide a comment or rating");
      return;
    }
    if (editText.length > 1e3) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }
    setIsSubmitting((prev) => ({ ...prev, [commentId]: true }));
    router.put(`/comments/${commentId}`, {
      comment: editText.trim() || null,
      rating: editRating || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Review updated successfully!");
        setEditingCommentId(null);
        setEditText("");
        setEditRating(0);
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: (errors) => {
        console.error("Update error:", errors);
        toast.error(errors.comment || "Failed to update review");
      },
      onFinish: () => {
        setIsSubmitting((prev) => ({ ...prev, [commentId]: false }));
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6", children: [
      "Reviews & Comments (",
      comments.length,
      ")"
    ] }),
    /* @__PURE__ */ jsx(
      CommentForm,
      {
        productId,
        authUser,
        isAuthenticated,
        existingReview: userReview,
        onSuccess: onCommentAdded
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comments.length > 0 ? comments.map((comment) => {
      const hasImageError = imageErrors[comment.id];
      const userColor = getUserColor(comment.user_id);
      const userInitials = comment.user?.name ? getUserInitials(comment.user.name) : "?";
      const isEditing = editingCommentId === comment.id;
      const isSubmittingComment = isSubmitting[comment.id];
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-paper-dim rounded-xl p-4 comment-enter hover:bg-paper-dim/80 transition-colors border border-line",
          children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: comment.user?.images && !hasImageError ? /* @__PURE__ */ jsx(
              "img",
              {
                src: comment.user.images.startsWith("http") ? comment.user.images : `/storage/${comment.user.images}`,
                alt: comment.user.name || "User image",
                className: "w-10 h-10 rounded-full object-cover border-2 border-line shadow-hard-sm",
                onError: () => handleImageError(comment.id)
              }
            ) : /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full bg-gradient-to-r ${userColor} flex items-center justify-center shadow-hard-sm`, children: comment.user?.name ? /* @__PURE__ */ jsx("span", { className: "text-black text-sm font-medium", children: userInitials }) : /* @__PURE__ */ jsx(FaUser, { className: "w-5 h-5 text-black" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink", children: comment.user?.name || "Anonymous User" }) }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-text-soft flex items-center", children: [
                  /* @__PURE__ */ jsx(FaClock, { className: "w-3 h-3 mr-1" }),
                  formatDate(comment.created_at),
                  comment.created_at !== comment.updated_at && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-text-soft", children: "(edited)" })
                ] })
              ] }),
              comment.rating && !isEditing && /* @__PURE__ */ jsx("div", { className: "mb-2", children: renderRatingStars(comment.rating, "sm") }),
              isEditing ? /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-ink mb-1", children: "Your Rating" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                    [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditRating(star),
                        onMouseEnter: () => setEditHoverRating(star),
                        onMouseLeave: () => setEditHoverRating(0),
                        className: "focus:outline-none",
                        disabled: isSubmittingComment,
                        children: star <= (editHoverRating || editRating) ? /* @__PURE__ */ jsx(FaStar, { className: "w-6 h-6 text-yellow-400 fill-current" }) : /* @__PURE__ */ jsx(FaRegStar, { className: "w-6 h-6 text-gray-300 hover:text-yellow-400" })
                      },
                      star
                    )),
                    editRating > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-text-soft", children: [
                      editRating,
                      " star",
                      editRating !== 1 ? "s" : ""
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: editText,
                    onChange: (e) => setEditText(e.target.value),
                    placeholder: "Write your comment... (optional)",
                    className: "w-full px-3 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft",
                    rows: 3,
                    maxLength: 1e3,
                    disabled: isSubmittingComment
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm text-text-soft", children: [
                    editText.length,
                    "/1000"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => cancelEditing(),
                        className: "px-3 py-1 text-sm text-text-soft hover:text-ink flex items-center rounded-lg hover:bg-paper-dim transition-colors",
                        disabled: isSubmittingComment,
                        children: [
                          /* @__PURE__ */ jsx(FaTimes, { className: "w-3 h-3 mr-1" }),
                          "Cancel"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => handleUpdate(comment.id),
                        disabled: isSubmittingComment || !editText.trim() && editRating === 0,
                        className: "px-3 py-1 text-sm bg-marigold hover:bg-marigold-dark text-white rounded-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg",
                        children: [
                          /* @__PURE__ */ jsx(FaCheck, { className: "w-3 h-3 mr-1" }),
                          isSubmittingComment ? "Saving..." : "Save"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                comment.comment && /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: comment.comment }),
                authUser && comment.user?.id === authUser.id && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex space-x-3", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => startEditing(comment),
                      className: "text-xs text-marigold hover:text-marigold-dark flex items-center transition-colors",
                      disabled: isSubmittingComment,
                      children: [
                        /* @__PURE__ */ jsx(FaEdit, { className: "w-3 h-3 mr-1" }),
                        "Edit"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => openDeleteDialog(comment.id),
                      className: "text-xs text-red-600 hover:text-red-700 flex items-center transition-colors",
                      disabled: isSubmittingComment,
                      children: [
                        /* @__PURE__ */ jsx(FaTrash, { className: "w-3 h-3 mr-1" }),
                        "Delete"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        },
        comment.id
      );
    }) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 bg-paper-dim rounded-xl border border-line", children: /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "No reviews yet. Be the first to review!" }) }) }),
    /* @__PURE__ */ jsx(Transition, { appear: true, show: isDeleteDialogOpen, as: Fragment$1, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: closeDeleteDialog, children: [
      /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment$1,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0",
          enterTo: "opacity-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-ink/50 backdrop-blur-sm" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: /* @__PURE__ */ jsx(
        Transition.Child,
        {
          as: Fragment$1,
          enter: "ease-out duration-300",
          enterFrom: "opacity-0 scale-95",
          enterTo: "opacity-100 scale-100",
          leave: "ease-in duration-200",
          leaveFrom: "opacity-100 scale-100",
          leaveTo: "opacity-0 scale-95",
          children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-hard-sm border border-line transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-red-600 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(FaExclamation, { className: "w-6 h-6 text-red-600" }) }),
              /* @__PURE__ */ jsx(
                Dialog.Title,
                {
                  as: "h3",
                  className: "text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink",
                  children: "Delete Review"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft", children: "Are you sure you want to delete this review? This action cannot be undone." }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "inline-flex justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-text-soft hover:bg-paper-dim hover:text-ink transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                  onClick: closeDeleteDialog,
                  disabled: isSubmitting[commentToDelete || ""],
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "inline-flex justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed",
                  onClick: handleDelete,
                  disabled: isSubmitting[commentToDelete || ""],
                  children: isSubmitting[commentToDelete || ""] ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                      /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                      /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                    ] }),
                    "Deleting..."
                  ] }) : "Delete"
                }
              )
            ] })
          ] })
        }
      ) }) })
    ] }) })
  ] });
}
export {
  CommentsList as default
};
