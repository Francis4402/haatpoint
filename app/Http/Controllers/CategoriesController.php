<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::all();

        return Inertia::render('dashboard/categories/index', [
            'categories' => $categories
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
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'categories' => 'required|string|max:255|unique:categories,categories',
                'brand' => 'required|json',
                'subcategory' => 'json',
                'sizes' => 'nullable|json',
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            // Decode JSON strings to arrays
            $brands = json_decode($request->input('brand'), true);
            $subcategories = json_decode($request->input('subcategory'), true);
            $sizes = json_decode($request->input('sizes') ?? '[]', true);

            // Validate arrays
            if (!is_array($brands) || empty($brands)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['brand' => 'At least one brand is required.']);
            }

            if (!is_array($subcategories) || empty($subcategories)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['subcategory' => 'At least one subcategory is required.']);
            }

            $category = new Categories();
            $category->categories = $validated['categories'];
            $category->brand = json_encode($brands);
            $category->subcategory = json_encode($subcategories);
            $category->sizes = json_encode(is_array($sizes) ? array_values(array_filter($sizes, fn ($s) => trim((string) $s) !== '')) : []);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image->getRealPath());
                $img->scaleDown(width: 800);

                $filename = 'category_' . time() . '_' . uniqid() . '.webp';
                $directory = 'category_images';
                $filePath = $directory . '/' . $filename;

                $encodedImage = (string) $img->toWebp(85);
                Storage::disk('public')->put($filePath, $encodedImage);

                $category->image = $filePath;
            }

            $category->save();

            return redirect()->back()->with('success', 'Category created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create category. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Categories $categories)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $categories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $store)
    {
        try {
            $category = Categories::findOrFail($store);

            $validated = $request->validate([
                'categories' => 'required|string|max:255|unique:categories,categories,' . $store,
                'brand' => 'required|json',
                'subcategory' => 'json',
                'sizes' => 'nullable|json',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'remove_image' => 'nullable|boolean',
            ]);

            // Decode JSON strings to arrays
            $brands = json_decode($request->input('brand'), true);
            $subcategories = json_decode($request->input('subcategory'), true);
            $sizes = json_decode($request->input('sizes') ?? '[]', true);

            // Validate arrays
            if (!is_array($brands) || empty($brands)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['brand' => 'At least one brand is required.']);
            }

            if (!is_array($subcategories) || empty($subcategories)) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['subcategory' => 'At least one subcategory is required.']);
            }

            // Update basic fields
            $category->categories = $validated['categories'];
            $category->brand = json_encode($brands);
            $category->subcategory = json_encode($subcategories);
            $category->sizes = json_encode(is_array($sizes) ? array_values(array_filter($sizes, fn ($s) => trim((string) $s) !== '')) : []);

            // Handle image removal
            if ($request->has('remove_image') && $request->remove_image) {
                if ($category->image) {
                    Storage::disk('public')->delete($category->image);
                    $category->image = null;
                }
            }

            // Handle new image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($category->image) {
                    Storage::disk('public')->delete($category->image);
                }

                $image = $request->file('image');
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image->getRealPath());
                $img->scaleDown(width: 800);

                $filename = 'category_' . time() . '_' . uniqid() . '.webp';
                $directory = 'category_images';
                $filePath = $directory . '/' . $filename;

                $encodedImage = (string) $img->toWebp(85);
                Storage::disk('public')->put($filePath, $encodedImage);

                $category->image = $filePath;
            }

            $category->save();

            return redirect()->back()->with('success', 'Category updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update category. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Categories::findOrFail($id);

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();
    }
}
