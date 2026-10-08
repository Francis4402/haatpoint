<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    /** @use HasFactory<\Database\Factories\OrdersFactory> */
    use HasFactory, HasUuids;

    /**
     * Every order status the orders.order_status enum accepts.
     */
    public const ORDER_STATUSES = [
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned',
    ];

    public const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

    /**
     * Finished orders. Reaching one is final: the order status can no longer be
     * touched, because there is nothing left to fulfil. A cancelled order is not
     * terminal by itself and may still be corrected while the payment is open.
     */
    public const TERMINAL_ORDER_STATUSES = ['delivered'];

    /**
     * Money that is already settled. The goods lifecycle stops here too, so a
     * paid or refunded order keeps whatever order status it had. Payment
     * itself stays editable, since a refund still has to be recordable.
     */
    public const SETTLED_PAYMENT_STATUSES = ['paid', 'refunded'];

    protected $table = 'orders';

    protected $fillable = [
        // IDs
        'user_id',
        'agent_id',
        'store_id',
        'product_id', // Added from schema

        // Order Identifiers
        'merchant_order_id', // Added from schema
        'order_number',

        // Sender Info (from store)
        'sender_name', // Added from schema
        'sender_phone', // Added from schema
        'sender_email',
        // Recipient Information
        'recipient_name',
        'recipient_email',
        'recipient_phone',
        'recipient_address',
        'recipient_city', // Added from schema
        'recipient_zone', // Added from schema
        'recipient_area', // Added from schema

        // Pathao Settings
        'delivery_type',
        'item_type',
        'special_instruction',

        // Order Details
        'item_quantity',
        'item_weight',
        'amount_to_collect',
        'item_description',
        'store_name',

        // Financial
        'subtotal',
        'delivery_charge',
        'total',

        // Discount/Coupon
        'coupon_code',
        'discount_amount',

        // Tracking
        'tracking_number',
        'shipping_method',

        // Status
        'payment_method',
        'payment_status',
        'order_status',

        // Additional
        'notes',
        'items',

        // Pathao response tracking (optional)
        'pathao_order_id',
        'pathao_consignment_id',
        'pathao_response',
    ];

    protected $casts = [
        // Decimal amounts
        'subtotal' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_to_collect' => 'decimal:2',
        'discount_amount' => 'decimal:2',

        // Integers
        'recipient_city' => 'integer',
        'recipient_zone' => 'integer',
        'recipient_area' => 'integer',
        'item_quantity' => 'integer',
        'item_weight' => 'integer', // In schema it's integer
        'delivery_type' => 'integer',
        'item_type' => 'integer',

        // JSON
        'pathao_response' => 'array',
        'items' => 'array',

        // Dates
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'payment_method' => 'cash_on_delivery',
        'payment_status' => 'pending',
        'order_status' => 'pending',
        'delivery_charge' => 0,
        'delivery_type' => 48,
        'item_type' => 2,
        'discount_amount' => 0,
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_id', 'id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'id');
    }

    public function scopeOrderStatus($query, string $status)
    {
        return $query->where('order_status', $status);
    }

    public function scopePaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopePathao($query)
    {
        return $query->where('shipping_method', 'pathao');
    }

    /**
     * Scope orders visible to an agent: orders for the agent's assigned store
     * (products sold by that store) plus orders the agent placed himself,
     * even when they come from another store.
     */
    public function scopeForAgent($query, string $agentId)
    {
        $storeIds = Store::where('agent_id', $agentId)->pluck('id');

        return $query->where(function ($q) use ($storeIds, $agentId) {
            $q->whereIn('store_id', $storeIds)
                ->orWhere('agent_id', $agentId);
        });
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Order statuses the given actor may move this order to. This is the single
     * source of truth shared by the update endpoint and the orders page UI, so
     * a dropdown can never offer a transition the backend would reject.
     *
     * The status freezes once the order is finished (delivered/cancelled) or
     * once the money is settled (paid/refunded). Only a superadmin can reopen it.
     */
    public function allowedOrderStatuses(bool $isSuperAdmin = false): array
    {
        if ($isSuperAdmin) {
            return self::ORDER_STATUSES;
        }

        if ($this->isOrderStatusLocked()) {
            return [$this->order_status];
        }

        return self::ORDER_STATUSES;
    }

    /**
     * True when the order has reached a point where its status must not move
     * again, either because it is finished or because the payment is settled.
     */
    public function isOrderStatusLocked(): bool
    {
        return in_array($this->order_status, self::TERMINAL_ORDER_STATUSES, true)
            || in_array($this->payment_status, self::SETTLED_PAYMENT_STATUSES, true);
    }

    public function isOrderStatusLockedReason(): ?string
    {
        if (in_array($this->order_status, self::TERMINAL_ORDER_STATUSES, true)) {
            return "This order is {$this->order_status}, which is final. Its status can no longer be changed.";
        }

        if ($this->isPaymentStatusLocked()) {
            return "Payment is {$this->payment_status}, so the order status can no longer be changed.";
        }

        return null;
    }

    /**
     * True once the money has moved: a paid or refunded order has its payment
     * recorded, so the payment status must not move again either.
     */
    public function isPaymentStatusLocked(): bool
    {
        return in_array($this->payment_status, self::SETTLED_PAYMENT_STATUSES, true);
    }

    public function isPaymentStatusLockedReason(): ?string
    {
        if (! $this->isPaymentStatusLocked()) {
            return null;
        }

        return "Payment is {$this->payment_status}, which is final. "
            . 'It can no longer be changed, and the order status is locked too.';
    }

    /**
     * Payment statuses the actor may pick. A settled payment only leaves the one
     * value it already has, so an agent can never quietly rewrite the money.
     */
    public function allowedPaymentStatuses(bool $isSuperAdmin = false): array
    {
        if ($isSuperAdmin) {
            return self::PAYMENT_STATUSES;
        }

        if ($this->isPaymentStatusLocked()) {
            return [$this->payment_status];
        }

        return self::PAYMENT_STATUSES;
    }

    public function canTransitionTo(string $target, bool $isSuperAdmin = false): bool
    {
        return in_array($target, $this->allowedOrderStatuses($isSuperAdmin), true);
    }

    /**
     * What the given actor is allowed to do with this order.
     *
     * An order can show up in an agent's list for two reasons: it may belong to
     * one of the agent's own stores, or the agent may have placed it as a
     * shopper at somebody else's store. Either way the agent may drive the
     * order and record its payment. Returning the resolved rules from one place
     * keeps the dropdown and the update endpoint from ever disagreeing.
     *
     * A settled payment (paid/refunded) locks both fields for agents and admins,
     * so the money cannot be quietly rewritten; a superadmin can always reopen
     * it to fix a mistake.
     *
     * @return array{canEdit: bool, reason: string|null, orderStatus: array<int, string>, paymentStatus: array<int, string>, orderStatusLocked: bool, paymentStatusLocked: bool, paymentStatusLockedReason: string|null}
     */
    public function editRulesFor($user, string $role): array
    {
        $denied = static fn (string $reason): array => [
            'canEdit' => false,
            'reason' => $reason,
            'orderStatus' => [],
            'paymentStatus' => [],
            'orderStatusLocked' => false,
            'paymentStatusLocked' => false,
            'paymentStatusLockedReason' => null,
        ];

        if (in_array($role, ['admin', 'superadmin'], true)) {
            $isSuperAdmin = $role === 'superadmin';

            // A superadmin is never locked and owns every order, so there is no
            // lock to explain; only a plain admin gets the reasons.
            return [
                'canEdit' => true,
                'reason' => $isSuperAdmin ? null : $this->isOrderStatusLockedReason(),
                'orderStatus' => $this->allowedOrderStatuses($isSuperAdmin),
                'paymentStatus' => $this->allowedPaymentStatuses($isSuperAdmin),
                'orderStatusLocked' => $isSuperAdmin ? false : $this->isOrderStatusLocked(),
                'paymentStatusLocked' => $isSuperAdmin ? false : $this->isPaymentStatusLocked(),
                'paymentStatusLockedReason' => $isSuperAdmin
                    ? null
                    : $this->isPaymentStatusLockedReason(),
            ];
        }

        if (!$user instanceof Agent) {
            return $denied('You do not have permission to update this order.');
        }

        $isOwnStoreOrder = $this->store && $this->store->agent_id === $user->id;
        $isAgentPlacedOrder = $this->agent_id === $user->id;

        if ($isOwnStoreOrder || $isAgentPlacedOrder) {
            return [
                'canEdit' => true,
                'reason' => $this->isOrderStatusLockedReason(),
                'orderStatus' => $this->allowedOrderStatuses(),
                'paymentStatus' => $this->allowedPaymentStatuses(),
                'orderStatusLocked' => $this->isOrderStatusLocked(),
                'paymentStatusLocked' => $this->isPaymentStatusLocked(),
                'paymentStatusLockedReason' => $this->isPaymentStatusLockedReason(),
            ];
        }

        return $denied('You do not have permission to update this order.');
    }

    /**
     * Statuses that must never be counted as revenue: money that was never
     * collected, returned, or belongs to a cancelled order.
     */
    public function scopeEarningRevenue($query)
    {
        return $query->where('payment_status', 'paid')
            ->where('order_status', '!=', 'cancelled');
    }

    public function isPathao(): bool
    {
        return $this->shipping_method === 'pathao';
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function isPending(): bool
    {
        return $this->order_status === 'pending';
    }

    public function isProcessing(): bool
    {
        return $this->order_status === 'processing';
    }

    public function isShipped(): bool
    {
        return $this->order_status === 'shipped';
    }

    public function isDelivered(): bool
    {
        return $this->order_status === 'delivered';
    }

    public function isCancelled(): bool
    {
        return $this->order_status === 'cancelled';
    }

    public function getFullAddressAttribute(): string
    {
        return $this->recipient_address;
    }

    public function getPathaoTrackingUrlAttribute(): ?string
    {
        if (!$this->pathao_consignment_id) {
            return null;
        }
        return 'https://pathao.com/track/' . $this->pathao_consignment_id;
    }

    public function isPathaoEligible(): bool
    {
        return $this->recipient_city &&
               $this->recipient_zone &&
               $this->recipient_area &&
               $this->recipient_address &&
               $this->recipient_phone;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = static::generateOrderNumber();
            }
        });
    }

    protected static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('YmdHis');
        $random = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        return $prefix . '-' . $timestamp . '-' . $random;
    }
}
