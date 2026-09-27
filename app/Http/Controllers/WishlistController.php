<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Http\Requests\StoreWishlistRequest;
use App\Http\Requests\UpdateWishlistRequest;
use App\Models\Comments;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlistItems = Wishlist::with('product.store')
            ->forOwner()
            ->paginate(12);

        $products = [];
        foreach ($wishlistItems->items() as $item) {
            if ($item->product) {
                $products[] = $item->product;
            }
        }


        $productIds = collect($products)->pluck('id')->toArray();


        $ratings = Comments::whereIn('product_id', $productIds)
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();


        $productRatings = [];
        foreach ($products as $product) {
            $productRatingData = $ratings->where('product_id', $product->id);
            $averageRating = $productRatingData->avg('rating') ?? 0;
            $ratingCount = $productRatingData->count();

            $productRatings[$product->id] = [
                'average' => round($averageRating, 1),
                'count' => $ratingCount
            ];
        }

        $wishlistProducts = [
            'data' => $products,
            'current_page' => $wishlistItems->currentPage(),
            'last_page' => $wishlistItems->lastPage(),
            'per_page' => $wishlistItems->perPage(),
            'total' => $wishlistItems->total(),
            'productRatings' => $productRatings,
        ];

        return Inertia::render('wishlist/index', [
            'wishlistProducts' => $wishlistProducts
        ]);
    }


    public function toggle(Request $request, $productId)
    {
        if (!Wishlist::isSignedIn()) {
            $message = 'Please login to manage wishlist';

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => $message]);
            }

            return response()->json(['success' => false, 'message' => $message], 401);
        }

        if (!Products::find($productId)) {
            $message = 'Product not found';

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => $message]);
            }

            return response()->json(['success' => false, 'message' => $message], 404);
        }

        $owner = Wishlist::currentOwner();

        $wishlistItem = Wishlist::forOwner($owner)
            ->where('product_id', $productId)
            ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
            $message = 'Product removed from wishlist';
        } else {
            Wishlist::create($owner + ['product_id' => $productId]);
            $message = 'Product added to wishlist';
        }

        return redirect()->back()->with('success', $message);
    }


    public function check($productId)
    {
        $isInWishlist = false;

        if (Wishlist::isSignedIn()) {
            $isInWishlist = Wishlist::forOwner()
                ->where('product_id', $productId)
                ->exists();
        }

        return response()->json([
            'success' => true,
            'isInWishlist' => $isInWishlist
        ]);
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
    public function store(StoreWishlistRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Wishlist $wishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wishlist $wishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWishlistRequest $request, Wishlist $wishlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wishlist $wishlist)
    {
        //
    }
}
