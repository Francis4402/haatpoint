<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * The bKash number buyers send the Pro fee to, the fees and terms.
     * Base: ৳100 / month. 6-Month plan offers a 10% discount: ৳540 for 6 months (saving ৳60).
     */
    public const BKASH_NUMBER = '01319052507';
    public const PRO_MONTHLY_PRICE = 100;
    public const PRO_6_MONTH_PRICE = 540; // 6 * 100 = 600 - 10% (60) = 540
    public const PRO_PRICE = 100;
    public const PRO_MONTHS = 6;

    public function sell(): Response
    {
        return Inertia::render('Sell', [
            'agentRegisterRoute' => route('agent.register'),
        ]);
    }

    public function showUpgrade(): Response
    {
        $user = Auth::guard('agent')->user() ?? Auth::user();

        return Inertia::render('dashboard/Upgrade', [
            'user' => $user,
            'pricing' => [
                'monthly' => self::PRO_MONTHLY_PRICE,
                'sixMonths' => self::PRO_6_MONTH_PRICE,
                'bkashNumber' => self::BKASH_NUMBER,
            ],
        ]);
    }

    /**
     * The bKash payment page. Shown right after a Pro signup and whenever an
     * expired or Pro-pending agent wants to activate/renew.
     */
    public function showPayment(Request $request): Response|RedirectResponse
    {
        $user = Auth::guard('agent')->user() ?? Auth::user();

        if (! $user instanceof Agent) {
            return redirect()->route('dashboard');
        }

        // Already approved and running: allow access if renewing or specifying months, otherwise redirect to dashboard.
        if ($user->isPro() && ! $request->has('renew') && ! $request->has('months')) {
            return redirect()->route('dashboard')
                ->with('success', 'Your HaatPoint Pro is already active.');
        }

        $requestedMonths = (int) $request->query('months');
        if (in_array($requestedMonths, [1, 6], true)) {
            $currentMonths = $requestedMonths;
            $currentAmount = $currentMonths === 1 ? self::PRO_MONTHLY_PRICE : self::PRO_6_MONTH_PRICE;
        } else {
            $currentAmount = (float) ($user->subscription_payment_amount ?: self::PRO_6_MONTH_PRICE);
            $currentMonths = $currentAmount <= 100 ? 1 : 6;
        }

        return Inertia::render('dashboard/SubscriptionPayment', [
            'user' => $user,
            'payment' => [
                'bkashNumber' => self::BKASH_NUMBER,
                'monthlyPrice' => self::PRO_MONTHLY_PRICE,
                'sixMonthPrice' => self::PRO_6_MONTH_PRICE,
                'amount' => $currentAmount,
                'months' => $currentMonths,
                'status' => $user->subscription_payment_status ?? 'none',
                'trxId' => $user->subscription_trx_id,
                'submittedAt' => $user->subscription_payment_submitted_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Store the bKash transaction id the agent pasted in. The payment stays
     * pending until a superadmin or admin approves it.
     */
    public function submitPayment(Request $request): RedirectResponse
    {
        $user = Auth::guard('agent')->user() ?? Auth::user();

        if (! $user instanceof Agent) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'trx_id' => ['required', 'string', 'min:6', 'max:40'],
            'months' => ['nullable', 'integer', 'in:1,6'],
        ]);

        $months = (int) ($validated['months'] ?? 6);
        $amount = $months === 1 ? self::PRO_MONTHLY_PRICE : self::PRO_6_MONTH_PRICE;

        $user->plan = 'pro';
        $user->subscription_payment_status = 'pending';
        $user->subscription_trx_id = $validated['trx_id'];
        $user->subscription_payment_amount = $amount;
        $user->subscription_payment_submitted_at = now();
        $user->save();

        return redirect()->route('dashboard.subscription.payment')
            ->with('success', 'Your account will be activated after checking the transaction id.');
    }

    /**
     * Superadmin approves a submitted bKash payment: activate Pro for the chosen
     * duration (1 or 6 months), extending from the current expiry when it is still in the future.
     */
    public function approve(Agent $agent): RedirectResponse
    {
        $base = $agent->subscription_ends_at && $agent->subscription_ends_at->isFuture()
            ? $agent->subscription_ends_at->copy()
            : now();

        $months = ((float) $agent->subscription_payment_amount) <= 100 ? 1 : 6;

        $agent->plan = 'pro';
        $agent->subscription_ends_at = $base->addMonths($months);
        $agent->subscription_payment_status = 'approved';
        $agent->save();

        $agent->syncProductStatusForPlan();

        return redirect()->back()
            ->with('success', "HaatPoint Pro activated for {$agent->name}.");
    }

    /**
     * Superadmin rejects a submitted bKash payment. The account stays locked
     * and the agent may submit a corrected transaction id.
     */
    public function reject(Agent $agent): RedirectResponse
    {
        $agent->subscription_payment_status = 'rejected';
        $agent->save();

        return redirect()->back()
            ->with('error', "Payment from {$agent->name} was rejected.");
    }
}
