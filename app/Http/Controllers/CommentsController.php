<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use Illuminate\Http\Request;
use App\Models\Products;

class CommentsController extends Controller
{
    /**
     * A comment may only be edited or removed by the account that wrote it.
     * The author lives in `users`, `agents` or `admins` depending on the guard
     * the session authenticated through, so a single Auth::id() comparison
     * would reject every agent and admin and would let a matching id from a
     * different table pass.
     */
    private function ownsComment(Comments $comment): bool
    {
        $owner = Comments::currentOwner();

        if ($owner['user_id'] !== null && $comment->user_id === $owner['user_id']) {
            return true;
        }

        if ($owner['agent_id'] !== null && $comment->agent_id === $owner['agent_id']) {
            return true;
        }

        if ($owner['admin_id'] !== null && $comment->admin_id === $owner['admin_id']) {
            return true;
        }

        return false;
    }

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


        $owner = Comments::currentOwner();

        if ($owner['user_id'] === null && $owner['agent_id'] === null && $owner['admin_id'] === null) {
            return redirect()->back()->withErrors(['error' => 'Please sign in to leave a review']);
        }

        $existingComment = Comments::forOwner($owner)
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
            $comment = Comments::create(array_merge($owner, [
                'product_id' => $request->product_id,
                'store_id' => $storeId,
                'comment' => $request->comment,
                'rating' => $request->rating,
            ]));

            $message = 'Your review has been added successfully!';
        }


        $comment->load('user', 'agent', 'admin');

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
        if (!$this->ownsComment($comment)) {
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

        $comment->load('user', 'agent', 'admin');

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comments $comment)
    {
        if (!$this->ownsComment($comment)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return redirect()->back();
    }

    public function getProductComments(Products $product)
    {
        // The parameter name has to match the {product} route placeholder,
        // otherwise implicit binding hands over an empty model and every
        // lookup silently returns nothing.
        $product->loadMissing('store');

        // Get all comments with the author's account data
        $comments = Comments::with(['user', 'agent', 'admin'])
            ->where('product_id', $product->id)
            ->latest()
            ->get()
            ->map(function ($comment) {
                $author = $comment->author();

                return [
                    'id' => (string) $comment->id,
                    'user_id' => (string) ($comment->user_id ?? $comment->agent_id ?? $comment->admin_id),
                    'product_id' => (string) $comment->product_id,
                    'store_id' => (string) $comment->store_id,
                    'comment' => $comment->comment,
                    'rating' => $comment->rating,
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                    'user' => $author ? [
                        'id' => $author->id,
                        'name' => $author->name,
                        'images' => $author->images ?? '',
                        'email' => $author->email,
                    ] : null,
                ];
            });

        // Calculate rating statistics
        $ratings = $comments->filter(function($comment) {
            return $comment['rating'] !== null;
        });

        $count = $ratings->count();
        $average = $count > 0 ? $ratings->avg('rating') : 0;


        $userReviewed = Comments::forOwner()
            ->where('product_id', $product->id)
            ->whereNotNull('rating')
            ->exists();

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
