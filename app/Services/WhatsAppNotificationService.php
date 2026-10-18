<?php

namespace App\Services;

use App\Models\Orders;
use App\Models\Store;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    /**
     * Default platform sender number (international format without leading +).
     */
    public const DEFAULT_SENDER_NUMBER = '8801319052507';

    /**
     * Build the premium order notification message in Bangla for the store agent.
     * Includes ordered products, pricing (without subtotal), delivery address,
     * and Pathao store pickup preparation alert.
     */
    public static function buildOrderMessage(Orders $order, ?Store $store = null): string
    {
        $order->loadMissing('orderItems');
        $store = $store ?? $order->store;

        $storeName = $store?->name ?? $order->store_name ?? 'মার্চেন্ট';
        $orderNumber = $order->order_number ?? $order->id;

        $lines = [];
        $lines[] = "━━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "🛍️ *নতুন অর্ডার নোটিফিকেশন*";
        $lines[] = "━━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "";
        $lines[] = "হ্যালো *{$storeName}*, আপনার দোকানে একটি নতুন অর্ডার এসেছে *#{$orderNumber}*!";
        $lines[] = "";
        $lines[] = "📦 *অর্ডারকৃত পণ্যসমূহ:*";
        $lines[] = "─────────────────────";

        $items = $order->orderItems ?? [];
        $index = 1;

        foreach ($items as $item) {
            $name = $item->product_name ?? 'পণ্য';
            $pid = $item->product_id ?? 'N/A';
            $qty = $item->quantity ?? 1;
            $unitPrice = number_format((float) $item->price, 2);
            $totalPrice = number_format((float) $item->total, 2);

            $lines[] = "{$index}. *{$name}*";
            $lines[] = "   • *প্রোডাক্ট আইডি:* `{$pid}`";

            if (!empty($item->size)) {
                $lines[] = "   • *সাইজ:* {$item->size}";
            }

            if (!empty($item->color)) {
                $lines[] = "   • *কালার:* {$item->color}";
            }

            $lines[] = "   • *পরিমাণ:* {$qty} টি";
            $lines[] = "   • *একক মূল্য:* ৳{$unitPrice}";
            $lines[] = "   • *মোট:* ৳{$totalPrice}";
            $lines[] = "";
            $index++;
        }

        $lines[] = "─────────────────────";
        $lines[] = "💰 *মূল্য ও পেমেন্ট বিবরণী:*";

        // Subtotal removed per user requirement

        if ((float) $order->delivery_charge > 0) {
            $lines[] = "• *ডেলিভারি চার্জ:* ৳" . number_format((float) $order->delivery_charge, 2);
        }

        // 10% cut from buyers (platform fee / markup)
        $buyerCut = (float) $order->total - (float) $order->delivery_charge - (float) $order->subtotal + (float) $order->discount_amount;
        if ($buyerCut <= 0 && (float) $order->subtotal > 0) {
            $buyerCut = round((float) $order->subtotal * 0.10, 2);
        }

        if ($buyerCut > 0) {
            $lines[] = "• *বায়ার থেকে ১০% কাট:* ৳" . number_format((float) $buyerCut, 2);
        }

        if ((float) $order->discount_amount > 0) {
            $lines[] = "• *ডিসকাউন্ট:* -৳" . number_format((float) $order->discount_amount, 2);
        }

        $lines[] = "• *সর্বমোট মূল্য:* ৳" . number_format((float) $order->total, 2);

        if ($order->payment_method === 'cash_on_delivery') {
            $lines[] = "• *সংগ্রহযোগ্য টাকা (COD):* ৳" . number_format((float) $order->amount_to_collect, 2);
        } else {
            $isBkash = in_array(strtolower($order->payment_method ?? ''), ['bikash', 'bkash']);
            $methodName = $isBkash ? 'বিকাশ (bKash - Send Money)' : strtoupper($order->payment_method ?? '');
            $lines[] = "• *পেমেন্ট মাধ্যম:* {$methodName}";
            if (!empty($order->transaction_id)) {
                $lines[] = "• *ট্রানজেকশন আইডি:* `{$order->transaction_id}`";
            }
            $isPaid = strtolower($order->payment_status ?? '') === 'paid';
            $lines[] = "• *পেমেন্ট স্ট্যাটাস:* " . ($isPaid ? 'পরিশোধিত (Paid)' : 'অপেক্ষমান (Pending)');
        }

        $lines[] = "";
        $lines[] = "🚚 *কাস্টমার ডেলিভারি ঠিকানা:*";
        $lines[] = "• *প্রাপক:* {$order->recipient_name} ({$order->recipient_phone})";
        $lines[] = "• *ঠিকানা:* {$order->recipient_address}";

        $lines[] = "";
        $lines[] = "⚠️ *জরুরি বার্তা:*";
        $lines[] = "পাঠাও আপনার স্টোরে যাবে, আপনার পণ্য প্রস্তুত রাখুন।";

        $lines[] = "";
        $lines[] = "━━━━━━━━━━━━━━━━━━━━━";
        $lines[] = "_HaatPoint Order Desk (01319052507) থেকে প্রেরিত_";

        return implode("\n", $lines);
    }

    /**
     * Clean and format phone number for WhatsApp international URL/API format.
     */
    public static function formatPhoneForWhatsApp(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }

        $cleaned = preg_replace('/[^0-9]/', '', $phone);

        // Bangladeshi local numbers starting with 01...
        if (str_starts_with($cleaned, '01') && strlen($cleaned) === 11) {
            return '88' . $cleaned;
        }

        // If already starts with 8801...
        if (str_starts_with($cleaned, '8801') && strlen($cleaned) === 13) {
            return $cleaned;
        }

        return $cleaned;
    }

    /**
     * Generate direct WhatsApp wa.me trigger link.
     */
    public static function getWhatsAppDirectUrl(Orders $order, ?Store $store = null): ?string
    {
        $store = $store ?? $order->store;
        $agentMobile = $store?->mobile ?? $store?->agent?->mobile ?? $order->sender_phone;

        $targetPhone = self::formatPhoneForWhatsApp($agentMobile);
        if (!$targetPhone) {
            return null;
        }

        $message = self::buildOrderMessage($order, $store);

        return "https://api.whatsapp.com/send?phone={$targetPhone}&text=" . rawurlencode($message);
    }

    /**
     * Attempt automated server-side dispatch if an automated gateway/webhook is configured.
     * Supports configurable webhook / Green-API / UltraMsg endpoints.
     */
    public static function sendAutomatedNotification(Orders $order, ?Store $store = null): bool
    {
        $webhookUrl = config('services.whatsapp.webhook_url');
        $store = $store ?? $order->store;
        $agentMobile = $store?->mobile ?? $store?->agent?->mobile ?? $order->sender_phone;
        $targetPhone = self::formatPhoneForWhatsApp($agentMobile);

        if (!$targetPhone) {
            Log::info("WhatsApp automated dispatch skipped: no mobile number for store {$order->store_id}");
            return false;
        }

        $message = self::buildOrderMessage($order, $store);

        // If a server-side gateway endpoint is defined in .env
        if (!empty($webhookUrl)) {
            try {
                $response = Http::timeout(5)->post($webhookUrl, [
                    'sender' => config('services.whatsapp.sender_number', self::DEFAULT_SENDER_NUMBER),
                    'recipient' => $targetPhone,
                    'message' => $message,
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ]);

                if ($response->successful()) {
                    Log::info("WhatsApp notification sent via automated webhook for order {$order->order_number}");
                    return true;
                }

                Log::warning("WhatsApp notification webhook failed for order {$order->order_number}: " . $response->body());
            } catch (\Exception $e) {
                Log::error("WhatsApp automated dispatch exception for order {$order->order_number}: " . $e->getMessage());
            }
        }

        return false;
    }
}
