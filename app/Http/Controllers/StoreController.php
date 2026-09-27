<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Comments;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user instanceof Agent) {
            $stores = Store::where('agent_id', $user->id)->get();
        } elseif ($user instanceof Admin) {
            $stores = Store::all();
        } else {
            $stores = Store::where('user_id', $user->id)->get();
        }

        $products = Products::whereIn('store_id', $stores->pluck('id'))->get();
        $orders = Orders::whereIn('store_id', $stores->pluck('id'))->get();
        return Inertia::render('dashboard/store/index', [
            'stores' => $stores,
            'products' => $products,
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/forms/CreateStoreForm');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:stores,name',
            'storetype' => 'required|string',
            'license' => 'nullable|string|max:24',
            'address' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'national_id' => [
                'required',
                'string',
                'unique:stores,national_id',
                'regex:/^\d{10}$|^\d{17}$/',
            ],
            'mobile' => 'required|string|unique:stores,mobile|min:11|max:11',
        ]);

        try {
            DB::beginTransaction();

            $user = Auth::user();

            if (!$user) {
                throw new \Exception('User not authenticated');
            }

            // An agent may only operate stores while their registered National
            // ID is valid, otherwise the store is considered closed to them.
            // (New agents always register with a valid NID; legacy agents with
            // no NID on file still pass the store form's own NID validation.)
            if ($user instanceof Agent
                && $user->national_id !== null
                && !preg_match('/^\d{10}$|^\d{17}$/', (string) $user->national_id)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['error' => 'You must provide a valid National ID to create a store. Without a valid National ID your store will be closed.']);
            }

            if ($user instanceof Agent && Store::where('agent_id', $user->id)->count() >= 3) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['error' => 'You can create at most 3 stores.']);
            }

            // Create store first
            $store = Store::create([
                'user_id' => $user->id,
                'agent_id' => $user instanceof Agent ? $user->id : null,
                'name' => $validated['name'],
                'email' => $user->email,
                'storetype' => $validated['storetype'],
                'license' => $validated['license'] ?? null,
                'address' => $validated['address'],
                'national_id' => $validated['national_id'],
                'mobile' => $validated['mobile'],
                'logo' => null
            ]);

            if ($request->hasFile('logo')) {

                $logo = $request->file('logo');

                // Always save as .jpg because the image is JPEG-encoded below
                $filename = 'store_' . $store->id . '_' . time() . '_' . Str::random(8) . '.jpg';

                $directory = 'store_logos';
                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($logo->getRealPath());

                $img->scaleDown(width: 800);
                $img->resizeCanvas($img->width(), $img->height(), 'ffffff');

                Storage::disk('public')->put(
                    $filePath,
                    (string) $img->encode(new JpegEncoder(quality: 90))
                );

                $store->update(['logo' => $filePath]);
            }

            $store->save();

            DB::commit();

            return redirect()->route('dashboard.store')
                ->with('success', 'Store created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create store. ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $store = Store::findOrFail($id);

        abort_if(!$store->is_active, 404);

        $products = Products::where('store_id', $store->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);

        // Get store ratings
        $storeRatings = Comments::where('store_id', $store->id)
            ->whereNull('product_id')
            ->whereNotNull('rating')
            ->get();

        $averageRating = $storeRatings->avg('rating') ?? 0;
        $reviewCount = $storeRatings->count();

        // Get product ratings for all products in this store
        $productIds = $products->pluck('id')->toArray();
        $productRatings = Comments::whereIn('product_id', $productIds)
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();

        // Calculate average ratings for each product
        $productRatingsData = [];
        foreach ($products as $product) {
            $productRatingData = $productRatings->where('product_id', $product->id);
            $averageProductRating = $productRatingData->avg('rating') ?? 0;
            $productReviewCount = $productRatingData->count();

            $productRatingsData[$product->id] = [
                'average' => round($averageProductRating, 1),
                'count' => $productReviewCount
            ];
        }

        $userStoreRating = null;

        if (Auth::check()) {
            $userRating = Comments::where('user_id', Auth::id())
                ->where('store_id', $store->id)
                ->whereNull('product_id')
                ->first();

            if ($userRating) {
                $userStoreRating = [
                    'id' => $userRating->id,
                    'rating' => $userRating->rating,
                    'comment' => $userRating->comment,
                ];
            }
        }

        return Inertia::render('storeproducts/index', [
            'store' => $store,
            'products' => $products,
            'wishlist' => $wishlist,
            'storeRating' => [
                'average' => round($averageRating, 1),
                'count' => $reviewCount,
            ],
            'productRatings' => $productRatingsData, // Add this
            'userStoreRating' => $userStoreRating,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $name)
    {
        $store = Store::where('name', $name)->first();

        return Inertia::render('dashboard/forms/StoreUpdateForm', [
            'store' => $store
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $store)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('stores', 'name')->ignore($store->id)
            ],
            'storetype' => 'required|string',
            'address' => 'required|string|max:255',
            'license' => [
                'nullable',
                'string',
                'max:24',
                Rule::unique('stores', 'license')->ignore($store->id)
            ],
            'national_id' => [
                'required',
                'string',
                'regex:/^\d{10}$|^\d{17}$/',
                Rule::unique('stores', 'national_id')->ignore($store->id)
            ],
            'mobile' => [
                'required',
                'string',
                'digits:11',
                Rule::unique('stores', 'mobile')->ignore($store->id)
            ],
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'remove_logo' => 'nullable|in:true,false,0,1',
        ]);


        $removeLogo = in_array($validated['remove_logo'] ?? 'false', ['true', '1', 1, true], true);

        if ($request->hasFile('logo')) {

            $file = $request->file('logo');

            // Always save as .jpg because the image is JPEG-encoded below
            $filename = 'store_' . $store->id . '_' . time() . '_' . Str::random(8) . '.jpg';

            $directory = 'store_logos';
            $filePath = $directory . '/' . $filename;

            // Delete old logo
            if ($store->logo) {
                Storage::disk('public')->delete($store->logo);
            }

            $manager = new ImageManager(new Driver());
            $img = $manager->read($file->getRealPath());

                $img->scaleDown(width: 800);
                $img->resizeCanvas($img->width(), $img->height(), 'ffffff');

                Storage::disk('public')->put(
                    $filePath,
                    (string) $img->encode(new JpegEncoder(quality: 90))
                );

                $validated['logo'] = $filePath;

        } elseif ($removeLogo) {

            if ($store->logo) {
                Storage::disk('public')->delete($store->logo);
            }

            $validated['logo'] = null;

        } else {
            unset($validated['logo']);
        }


        $store->update([
            'name' => $validated['name'],
            'storetype' => $validated['storetype'],
            'address' => $validated['address'],
            'license' => $validated['license'],
            'mobile' => $validated['mobile'],
            'national_id' => $validated['national_id'],
        ]);


        if (isset($validated['logo'])) {
            $store->logo = $validated['logo'];
            $store->save();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        if ($store->logo && Storage::disk('public')->exists($store->logo)) {
            Storage::disk('public')->delete($store->logo);
        }

        $products = Products::where('store_id', $store->id)->get();

        foreach ($products as $product) {

            if ($product->images) {
                $images = json_decode($product->images, true);

                if (is_array($images)) {

                    foreach ($images as $image) {
                        if ($image && Storage::disk('public')->exists($image)) {
                            Storage::disk('public')->delete($image);
                        }
                    }
                } else {

                    if ($product->images && Storage::disk('public')->exists($product->images)) {
                        Storage::disk('public')->delete($product->images);
                    }
                }
            }


            $product->delete();
        }


        $store->delete();
    }

    /**
     * Public store directory (route: stores.index).
     */
    public function storeroute()
    {
        return Inertia::render('stores/index', [
            'stores' => Store::where('is_active', true)->latest()->get(),
            'wishlist' => Wishlist::where('user_id', Auth::id())->paginate(12),
        ]);
    }

    /**
     * Show products for a store (dashboard).
     */
    public function products($id)
    {
        $store = Store::findOrFail($id);
        $products = Products::where('store_id', $store->id)->get();

        return Inertia::render('dashboard/store/index', [
            'stores' => collect([$store]),
            'products' => $products,
            'orders' => Orders::where('store_id', $store->id)->get(),
        ]);
    }

    /**
     * Show analytics for a store (dashboard).
     */
    public function analytics($id)
    {
        $store = Store::findOrFail($id);

        return Inertia::render('dashboard/analytics/index', [
            'store' => $store,
        ]);
    }

    /**
     * Toggle a store's active status.
     */
    public function toggleActive($id)
    {
        $store = Store::findOrFail($id);
        $store->is_active = ! $store->is_active;
        $store->save();

        return back();
    }
}
