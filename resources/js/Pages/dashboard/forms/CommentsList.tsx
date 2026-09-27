
import { FaUser, FaClock, FaEdit, FaTrash, FaTimes, FaCheck, FaStar, FaRegStar, FaExclamation } from "react-icons/fa";
import { useState, Fragment } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import CommentForm from "./CommentForm";
import { Comments } from "@/types";

interface CommentsListProps {
    comments: Comments[];
    productId: string;
    authUser: any;
    isAuthenticated: boolean;
    userReview?: {
        id: string;
        comment: string | null;
        rating: number | null;
    } | null;
    onCommentAdded?: () => void;
}

export default function CommentsList({
    comments,
    productId,
    authUser,
    isAuthenticated,
    userReview,
    onCommentAdded
}: CommentsListProps) {

    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [editRating, setEditRating] = useState<number>(0);
    const [editHoverRating, setEditHoverRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleImageError = (commentId: string) => {
        setImageErrors(prev => ({ ...prev, [commentId]: true }));
    };

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getUserColor = (userId: string) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-red-500 to-red-600',
            'from-yellow-500 to-yellow-600',
            'from-indigo-500 to-indigo-600',
            'from-pink-500 to-pink-600',
            'from-teal-500 to-teal-600'
        ];

        const index = parseInt(userId) % colors.length;
        return colors[index];
    };

    const renderRatingStars = (rating: number | null, size: 'sm' | 'md' = 'sm') => {
        if (!rating) return null;

        const starClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= rating ? (
                            <FaStar className={`${starClass} text-yellow-400 fill-current`} />
                        ) : (
                            <FaRegStar className={`${starClass} text-gray-300`} />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    const openDeleteDialog = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setCommentToDelete(null);
    };

    const handleDelete = () => {
        if (!commentToDelete) return;

        setIsSubmitting(prev => ({ ...prev, [commentToDelete]: true }));

        router.delete(`/comments/${commentToDelete}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review deleted successfully!');
                closeDeleteDialog();

                if (onCommentAdded) {
                    onCommentAdded();
                }
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                toast.error(errors.message || 'Failed to delete review');
                closeDeleteDialog();
            },
            onFinish: () => {
                setIsSubmitting(prev => ({ ...prev, [commentToDelete || '']: false }));
            }
        });
    };

    const startEditing = (comment: Comments) => {
        setEditingCommentId(comment.id);
        setEditText(comment.comment || "");
        setEditRating(comment.rating || 0);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditText("");
        setEditRating(0);
    };

    const handleUpdate = (commentId: string) => {
        if (!editText.trim() && editRating === 0) {
            toast.error('Please provide a comment or rating');
            return;
        }

        if (editText.length > 1000) {
            toast.error('Comment must be less than 1000 characters');
            return;
        }

        setIsSubmitting(prev => ({ ...prev, [commentId]: true }));

        router.put(`/comments/${commentId}`, {
            comment: editText.trim() || null,
            rating: editRating || null
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review updated successfully!');
                setEditingCommentId(null);
                setEditText("");
                setEditRating(0);
                if (onCommentAdded) {
                    onCommentAdded();
                }
            },
            onError: (errors) => {
                console.error('Update error:', errors);
                toast.error(errors.comment || 'Failed to update review');
            },
            onFinish: () => {
                setIsSubmitting(prev => ({ ...prev, [commentId]: false }));
            }
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-6">
                Reviews & Comments ({comments.length})
            </h3>

            <CommentForm
                productId={productId}
                authUser={authUser}
                isAuthenticated={isAuthenticated}
                existingReview={userReview}
                onSuccess={onCommentAdded}
            />

            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => {
                        const hasImageError = imageErrors[comment.id];
                        const userColor = getUserColor(comment.user_id);
                        const userInitials = comment.user?.name ? getUserInitials(comment.user.name) : '?';
                        const isEditing = editingCommentId === comment.id;
                        const isSubmittingComment = isSubmitting[comment.id];

                        return (
                            <div
                                key={comment.id}
                                className="bg-paper-dim rounded-xl p-4 comment-enter hover:bg-paper-dim/80 transition-colors border border-line"
                            >
                                <div className="flex space-x-3">
                                    {/* User Image */}
                                    <div className="flex-shrink-0">
                                        {comment.user?.images && !hasImageError ? (
                                            <img
                                                src={comment.user.images.startsWith('http')
                                                    ? comment.user.images
                                                    : `/storage/${comment.user.images}`}
                                                alt={comment.user.name || 'User image'}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-line shadow-hard-sm"
                                                onError={() => handleImageError(comment.id)}
                                            />
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${userColor} flex items-center justify-center shadow-hard-sm`}>
                                                {comment.user?.name ? (
                                                    <span className="text-black text-sm font-medium">
                                                        {userInitials}
                                                    </span>
                                                ) : (
                                                    <FaUser className="w-5 h-5 text-black" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Comment Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-ink">
                                                    {comment.user?.name || 'Anonymous User'}
                                                </h4>
                                            </div>
                                            <span className="text-xs text-text-soft flex items-center">
                                                <FaClock className="w-3 h-3 mr-1" />
                                                {formatDate(comment.created_at)}
                                                {comment.created_at !== comment.updated_at && (
                                                    <span className="ml-2 text-xs text-text-soft">(edited)</span>
                                                )}
                                            </span>
                                        </div>

                                        {/* Display Rating if exists */}
                                        {comment.rating && !isEditing && (
                                            <div className="mb-2">
                                                {renderRatingStars(comment.rating, 'sm')}
                                            </div>
                                        )}

                                        {/* Edit mode or view mode */}
                                        {isEditing ? (
                                            <div className="mt-2">
                                                {/* Edit Rating Stars */}
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-ink mb-1">
                                                        Your Rating
                                                    </label>
                                                    <div className="flex items-center space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setEditRating(star)}
                                                                onMouseEnter={() => setEditHoverRating(star)}
                                                                onMouseLeave={() => setEditHoverRating(0)}
                                                                className="focus:outline-none"
                                                                disabled={isSubmittingComment}
                                                            >
                                                                {star <= (editHoverRating || editRating) ? (
                                                                    <FaStar className="w-6 h-6 text-yellow-400 fill-current" />
                                                                ) : (
                                                                    <FaRegStar className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                                                                )}
                                                            </button>
                                                        ))}
                                                        {editRating > 0 && (
                                                            <span className="ml-2 text-sm text-text-soft">
                                                                {editRating} star{editRating !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Edit Comment Textarea */}
                                                <textarea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    placeholder="Write your comment... (optional)"
                                                    className="w-full px-3 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                                    rows={3}
                                                    maxLength={1000}
                                                    disabled={isSubmittingComment}
                                                />
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-sm text-text-soft">
                                                        {editText.length}/1000
                                                    </span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => cancelEditing()}
                                                            className="px-3 py-1 text-sm text-text-soft hover:text-ink flex items-center rounded-lg hover:bg-paper-dim transition-colors"
                                                            disabled={isSubmittingComment}
                                                        >
                                                            <FaTimes className="w-3 h-3 mr-1" />
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdate(comment.id)}
                                                            disabled={isSubmittingComment || (!editText.trim() && editRating === 0)}
                                                            className="px-3 py-1 text-sm bg-marigold hover:bg-marigold-dark text-white rounded-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                                                        >
                                                            <FaCheck className="w-3 h-3 mr-1" />
                                                            {isSubmittingComment ? 'Saving...' : 'Save'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {comment.comment && (
                                                    <p className="text-text-soft">{comment.comment}</p>
                                                )}

                                                {/* Show edit/delete buttons if the comment belongs to current user */}
                                                {authUser && comment.user?.id === authUser.id && (
                                                    <div className="mt-2 flex space-x-3">
                                                        <button
                                                            onClick={() => startEditing(comment)}
                                                            className="text-xs text-marigold hover:text-marigold-dark flex items-center transition-colors"
                                                            disabled={isSubmittingComment}
                                                        >
                                                            <FaEdit className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteDialog(comment.id)}
                                                            className="text-xs text-red-600 hover:text-red-700 flex items-center transition-colors"
                                                            disabled={isSubmittingComment}
                                                        >
                                                            <FaTrash className="w-3 h-3 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 bg-paper-dim rounded-xl border border-line">
                        <p className="text-text-soft">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Transition appear show={isDeleteDialogOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeDeleteDialog}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-hard-sm border border-line transition-all">
                                    <div className="flex items-center space-x-3 text-red-600 mb-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <FaExclamation className="w-6 h-6 text-red-600" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink"
                                        >
                                            Delete Review
                                        </Dialog.Title>
                                    </div>

                                    <div className="mt-2">
                                        <p className="text-sm text-text-soft">
                                            Are you sure you want to delete this review? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-text-soft hover:bg-paper-dim hover:text-ink transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={closeDeleteDialog}
                                            disabled={isSubmitting[commentToDelete || '']}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleDelete}
                                            disabled={isSubmitting[commentToDelete || '']}
                                        >
                                            {isSubmitting[commentToDelete || ''] ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
