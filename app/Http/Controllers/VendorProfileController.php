<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorProfileController extends Controller
{
    /**
     * Show the vendor's own KYC form.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public function edit(Request $request): Response
    {
        $agent = $this->agent($request);

        return Inertia::render('dashboard/vendor/VendorProfile', [
            'vendor' => [
                'name' => $agent->name,
                'email' => $agent->email,
                'images' => $agent->images,
                'mobile' => $agent->mobile,
                'national_id' => $agent->national_id,
                'address' => $agent->address,
            ],
            'missingFields' => $agent->missingVendorProfileFields(),
            'isComplete' => $agent->hasCompleteVendorProfile(),
        ]);
    }

    /**
     * Save the vendor's KYC details.
     *
     * The mobile regex mirrors Agent::missingVendorProfileFields(). Both sides
     * have to agree or a vendor can save a value the gate still rejects.
     */
    public function update(Request $request): RedirectResponse
    {
        $agent = $this->agent($request);

        // An unconfirmed address means the vendor may not act as a vendor yet,
        // but saving their details is exactly what they should be able to do,
        // so this is not gated here.
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
            'national_id' => ['required', 'string', 'regex:/^\d{10}$|^\d{17}$/'],
            'address' => ['required', 'string', 'max:1000'],
            'images' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        if ($request->hasFile('images')) {
            $validated['images'] = $request->file('images')->store('agent-images', 'public');
        }

        $agent->update($validated);

        // Redirect to the page the vendor was trying to reach. Falls back to
        // the profile itself when they arrived here directly, because going
        // back after a save usually lands on the form they just left.
        $intended = $request->query('redirect_to');

        return redirect()
            ->to($intended && str_starts_with($intended, '/') ? $intended : route('vendor.profile.edit'))
            ->with('success', 'Your vendor details have been saved.');
    }

    /**
     * Resolve the signed-in agent, rejecting any other account type.
     *
     * The route is reachable by every dashboard role, so the guard cannot rely
     * on the route middleware alone.
     */
    private function agent(Request $request): Agent
    {
        $agent = $request->user();

        abort_unless($agent instanceof Agent, 403);

        return $agent;
    }
}