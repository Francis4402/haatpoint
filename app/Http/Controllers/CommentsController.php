<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'comment' => 'nullable|string|min:3|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);


        if (!$request->comment && !$request->rating) {
            return redirect()->back()->withErrors(['error' => 'Please provide a comment or rating']);
        }

        $product = Products::with('store')->findOrFail($request->product_id);
        $storeId = $product->store_id ?? $product->store?->id;


        $existingComment = Comments::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingComment) {
            // Update existing comment
            $existingComment->update([
                'comment' => $request->comment ?? $existingComment->comment,
                'rating' => $request->rating ?? $existingComment->rating,
            ]);

            $comment = $existingComment;
            $message = 'Your review has been updated!';
        } else {
            // Create new comment
            $comment = Comments::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'store_id' => $storeId,
                'comment' => $request->comment,
                'rating' => $request->rating,
            ]);

            $message = 'Your review has been added successfully!';
        }


        $comment->load('user');

        if ($request->wantsJson() || $request->inertia()) {
            return redirect()->back()->with('success', $message);
        }

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comments $comments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comments $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $request->validate([
            'comment' => 'nullable|string|min:3|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $comment->update([
            'comment' => $request->comment,
            'rating' => $request->rating,
        ]);

        $comment->load('user');

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comments $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return redirect()->back();
    }

    public function getProductComments(Products $productId)
    {
        $product = Products::findOrFail($productId);

        // Get all comments with user data
        $comments = Comments::with('user')
            ->where('product_id', $product->id)
            ->latest()
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => (string) $comment->id,
                    'user_id' => (string) $comment->user_id,
                    'product_id' => (string) $comment->product_id,
                    'store_id' => (string) $comment->store_id,
                    'comment' => $comment->comment,
                    'rating' => $comment->rating,
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                    'user' => $comment->user ? [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                        'images' => $comment->user->images ?? '',
                        'email' => $comment->user->email,
                    ] : null,
                ];
            });

        // Calculate rating statistics
        $ratings = $comments->filter(function($comment) {
            return $comment['rating'] !== null;
        });

        $count = $ratings->count();
        $average = $count > 0 ? $ratings->avg('rating') : 0;


        $userReviewed = false;
        if (Auth::check()) {
            $userReviewed = Comments::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->whereNotNull('rating')
                ->exists();
        }

        return response()->json([
            'success' => true,
            'data' => $comments,
            'stats' => [
                'count' => $count,
                'average' => round($average, 1),
                'user_reviewed' => $userReviewed,
            ]
        ]);
    }
}
