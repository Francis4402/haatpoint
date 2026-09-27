<?php

namespace App\Http\Controllers;

use App\Models\Pathao;
use Illuminate\Http\Request;
use App\Http\Requests\StorePathaoRequest;
use App\Http\Requests\UpdatePathaoRequest;
use Enan\PathaoCourier\Facades\PathaoCourier;
use Enan\PathaoCourier\Requests\PathaoOrderPriceCalculationRequest;

class PathaoController extends Controller
{
    public function cities()
    {
        $cities = PathaoCourier::GET_CITIES();
        return response()->json($cities);
    }

    public function zones($city_id)
    {
        $zones = PathaoCourier::GET_ZONES($city_id);
        return response()->json($zones);
    }

    public function areas($zone_id)
    {
        $areas = PathaoCourier::GET_AREAS($zone_id);
        return response()->json($areas);
    }


    public function calculatePrice(Request $request)
    {
        try {

            $validated = $request->validate([
                'store_id' => 'required|integer',
                'sender_city' => 'required|integer',
                'recipient_city' => 'required|integer',
                'recipient_zone' => 'required|integer',
                'recipient_area' => 'nullable|integer',
                'item_type' => 'required|integer|in:1,2',
                'item_weight' => 'required|numeric|min:0.5',
                'item_quantity' => 'required|integer|min:1',
                'amount_to_collect' => 'required|numeric|min:0',
                'delivery_type' => 'required|integer|in:12,48',
            ]);


            // Create Pathao price request
            $priceRequest = new PathaoOrderPriceCalculationRequest();
            $priceRequest->merge($validated);

            // Call Pathao API
            $response = PathaoCourier::GET_PRICE_CALCULATION($priceRequest);


            return response()->json($response);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate price',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getStores(Request $request)
    {
        $pathoStore = PathaoCourier::GET_STORES(1, $request);

        return response()->json($pathoStore);
    }


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
    public function store(StorePathaoRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Pathao $pathao)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pathao $pathao)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePathaoRequest $request, Pathao $pathao)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pathao $pathao)
    {
        //
    }
}
