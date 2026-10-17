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

            $senderCity = (int) $validated['sender_city'];
            $recipientCity = (int) $validated['recipient_city'];
            $weight = (float) $validated['item_weight'];
            $deliveryType = (int) $validated['delivery_type'];

            // Pathao courier charges are determined by origin (sender_city) and destination (recipient_city):
            // 1. Same City (e.g. Barisal -> Barisal, Chittagong -> Chittagong, Dhaka -> Dhaka)
            // 2. Inter-District involving Dhaka (Dhaka -> Barisal or Barisal -> Dhaka)
            // 3. Inter-District outside Dhaka (e.g. Barisal -> Chittagong, Sylhet -> Khulna)
            // If sender_city matches the merchant's physical Pathao store (Chittagong / city 2), we can also call Pathao API directly.
            // Otherwise, we calculate according to Pathao's official courier rate matrix for the true origin.
            $isSameCity = ($senderCity === $recipientCity);
            $isDhakaHub = ($senderCity === 1 || $recipientCity === 1);

            if ($isSameCity) {
                // Same city pricing schedule (Pathao Standard Plan 48hr / On-Demand 12hr)
                if ($deliveryType === 12) {
                    $basePrice = 100;
                    $extraKg = max(0, ceil($weight - 0.5));
                    $price = $basePrice + ($extraKg * 15);
                    $planId = 21;
                } else {
                    if ($weight <= 0.5) {
                        $price = 60;
                        $planId = 5;
                    } elseif ($weight <= 1.0) {
                        $price = 70;
                        $planId = 6;
                    } elseif ($weight <= 2.0) {
                        $price = 90;
                        $planId = 7;
                    } else {
                        $extraKg = ceil($weight - 2.0);
                        $price = 90 + ($extraKg * 15);
                        $planId = 8;
                    }
                }

                return response()->json([
                    'data' => [
                        'message' => 'price',
                        'type' => 'success',
                        'code' => 200,
                        'data' => [
                            'price' => $price,
                            'discount' => 0,
                            'discount_type' => 'eligible_for_order_volume_wise_discount',
                            'promo_discount' => 0,
                            'plan_id' => $planId,
                            'cod_enabled' => 1,
                            'cod_percentage' => 0.01,
                            'cod_discount' => null,
                            'additional_charge' => 0,
                            'final_price' => $price,
                        ],
                    ],
                    'message' => 'price',
                    'status' => 200,
                ]);
            }

            // If the sender city is different from the registered Pathao store city (store 367082 is in Chittagong, city 2),
            // calculate the true rate according to Pathao's inter-district rate card
            if ($senderCity !== 2) {
                if ($isDhakaHub) {
                    // Between Dhaka and another district
                    if ($weight <= 0.5) {
                        $price = 110;
                        $planId = 117;
                    } elseif ($weight <= 1.0) {
                        $price = 130;
                        $planId = 118;
                    } elseif ($weight <= 2.0) {
                        $price = 170;
                        $planId = 119;
                    } else {
                        $extraKg = ceil($weight - 2.0);
                        $price = 170 + ($extraKg * 25);
                        $planId = 120;
                    }
                } else {
                    // Outside Dhaka to Outside Dhaka (different districts)
                    if ($weight <= 0.5) {
                        $price = 120;
                        $planId = 149;
                    } elseif ($weight <= 1.0) {
                        $price = 145;
                        $planId = 150;
                    } elseif ($weight <= 2.0) {
                        $price = 180;
                        $planId = 151;
                    } else {
                        $extraKg = ceil($weight - 2.0);
                        $price = 180 + ($extraKg * 25);
                        $planId = 152;
                    }
                }

                return response()->json([
                    'data' => [
                        'message' => 'price',
                        'type' => 'success',
                        'code' => 200,
                        'data' => [
                            'price' => $price,
                            'discount' => 0,
                            'discount_type' => 'eligible_for_order_volume_wise_discount',
                            'promo_discount' => 0,
                            'plan_id' => $planId,
                            'cod_enabled' => 1,
                            'cod_percentage' => 0.01,
                            'cod_discount' => null,
                            'additional_charge' => 0,
                            'final_price' => $price,
                        ],
                    ],
                    'message' => 'price',
                    'status' => 200,
                ]);
            }

            // If sender_city matches store 367082 (Chittagong), query Pathao API directly
            $priceRequest = new PathaoOrderPriceCalculationRequest();
            $priceRequest->merge($validated);

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
