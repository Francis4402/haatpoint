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
     * The bKash number buyers send the Pro fee to, the fee itself and the
     * length of a Pro term. Kept in one place so the page copy, the stored
     * amount and the approval all agree.
     */
    public const BKASH_NUMBER = '01319052507';
    public const PRO_PRICE = 500;
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
        ]);
    }

    /**
     * The bKash payment page. Shown right after a Pro signup and whenever an
     * expired or Pro-pending agent wants to activate/renew.
     */
    public function showPayment(): Response|RedirectResponse
    {
        $user = Auth::guard('agent')->user() ?? Auth::user();

        if (! $user instanceof Agent) {
            return redirect()->route('dashboard');
        }

        // Already approved and running: nothing left to pay for here.
        if ($user->isPro()) {
            return redirect()->route('dashboard')
                ->with('success', 'Your HaatPoint Pro is already active.');
        }

        return Inertia::render('dashboard/SubscriptionPayment', [
            'user' => $user,
            'payment' => [
                'bkashNumber' => self::BKASH_NUMBER,
                'amount' => self::PRO_PRICE,
                'months' => self::PRO_MONTHS,
                'status' => $user->subscription_payment_status ?? 'none',
                'trxId' => $user->subscription_trx_id,
                'submittedAt' => $user->subscription_payment_submitted_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Store the bKash transaction id the agent pasted in. The payment stays
     * pending until a superadmin approves it.
     */
    public function submitPayment(Request $request): RedirectResponse
    {
        $user = Auth::guard('agent')->user() ?? Auth::user();

        if (! $user instanceof Agent) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'trx_id' => ['required', 'string', 'min:6', 'max:40'],
        ]);

        $user->plan = 'pro';
        $user->subscription_payment_status = 'pending';
        $user->subscription_trx_id = $validated['trx_id'];
        $user->subscription_payment_amount = self::PRO_PRICE;
        $user->subscription_payment_submitted_at = now();
        $user->save();

        return redirect()->route('dashboard.subscription.payment')
            ->with('success', 'Payment submitted! If your transaction ID is correct, then your account will be activated.');
    }

    /**
     * Superadmin approves a submitted bKash payment: activate Pro for six
     * months, extending from the current expiry when it is still in the future.
     */
    public function approve(Agent $agent): RedirectResponse
    {
        $base = $agent->subscription_ends_at && $agent->subscription_ends_at->isFuture()
            ? $agent->subscription_ends_at->copy()
            : now();

        $agent->plan = 'pro';
        $agent->subscription_ends_at = $base->addMonths(self::PRO_MONTHS);
        $agent->subscription_payment_status = 'approved';
        $agent->save();

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
