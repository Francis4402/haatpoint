<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Reviews;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateReviewsRequest;
use Illuminate\Support\Facades\Auth;

class ReviewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            Reviews::create([
                'product_id' => $request->product_id,
                'user_id' => Auth::id(),
            ]);

            $count = Reviews::where('product_id', $request->product_id)->count();

            return response()->json([
                'success' => true,
                'message' => 'View recorded',
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording view: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * View counter for a product (route: reviews.status).
     */
    public function status(string $slug)
    {
        $product = Products::where('slug', $slug)->firstOrFail();

        return response()->json([
            'count' => Reviews::where('product_id', $product->id)->count(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $count = Reviews::where('product_id', $id)->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reviews $reviews)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewsRequest $request, Reviews $reviews)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviews $reviews)
    {
        //
    }
}
