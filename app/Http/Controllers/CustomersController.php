<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Http\Requests\StoreCustomersRequest;
use App\Http\Requests\UpdateCustomersRequest;
use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $customers = collect()
            ->merge(User::all())
            ->merge(Admin::all())
            ->merge(Agent::all())
            ->values();

        return Inertia::render('dashboard/customers/index', [
            'customers' => $customers,
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
     * Superadmin: promote a user to the admin role.
     */
    public function promote(User $user): RedirectResponse
    {
        if (Admin::where('email', $user->email)->exists()) {
            return redirect()->back()->with('error', "{$user->name} is already an admin.");
        }

        DB::transaction(function () use ($user) {
            // Copy the user's password hash verbatim. Admin has a 'hashed' cast,
            // so mass-assigning would double-hash it and break login.
            DB::table('admins')->insert([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
                'role' => 'admin',
                'images' => $user->images,
                'email_verified_at' => $user->email_verified_at,
                'blocked' => $user->blocked,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // The promoted account no longer exists as a customer: detach its
            // business data (orders/products/stores) so it survives the delete.
            DB::table('orders')->where('user_id', $user->id)->update(['user_id' => null]);
            DB::table('products')->where('user_id', $user->id)->update(['user_id' => null]);
            DB::table('stores')->where('user_id', $user->id)->update(['user_id' => null]);

            $user->delete();
        });

        return redirect()->back()->with('success', "{$user->name} has been promoted to admin.");
    }

    /**
     * Convert a user to an agent. Admin/Superadmin only.
     */
    public function makeAgent(User $user): RedirectResponse
    {
        if (Agent::where('email', $user->email)->exists()) {
            return redirect()->back()->with('error', "{$user->name} is already an agent.");
        }

        DB::transaction(function () use ($user) {
            $agentId = (string) \Illuminate\Support\Str::uuid();

            DB::table('agents')->insert([
                'id' => $agentId,
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
                'role' => 'agent',
                'images' => $user->images,
                'email_verified_at' => $user->email_verified_at,
                'blocked' => $user->blocked,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Keep the user's stores owned by them under the new agent id,
            // but detach purchase/order ownership so it survives the delete.
            DB::table('stores')->where('user_id', $user->id)->update([
                'user_id' => null,
                'agent_id' => $agentId,
            ]);
            DB::table('orders')->where('user_id', $user->id)->update(['user_id' => null]);
            DB::table('products')->where('user_id', $user->id)->update(['user_id' => null]);

            $user->delete();
        });

        return redirect()->back()->with('success', "{$user->name} is now an agent.");
    }

    /**
     * Convert an agent back to a user. Admin/Superadmin only.
     */
    public function makeUser(Agent $agent): RedirectResponse
    {
        if (User::where('email', $agent->email)->exists()) {
            return redirect()->back()->with('error', "{$agent->name} is already a customer.");
        }

        DB::transaction(function () use ($agent) {
            DB::table('users')->insert([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => $agent->name,
                'email' => $agent->email,
                'password' => $agent->password,
                'role' => 'user',
                'images' => $agent->images,
                'email_verified_at' => $agent->email_verified_at,
                'blocked' => $agent->blocked,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Drop agent ownership so the store/order dashboards don't show
            // these under a non-agent account.
            DB::table('stores')->where('agent_id', $agent->id)->update(['agent_id' => null]);
            DB::table('orders')->where('agent_id', $agent->id)->update(['agent_id' => null]);

            $agent->delete();
        });

        return redirect()->back()->with('success', "{$agent->name} is now a customer.");
    }

    /**
     * Superadmin: block/unblock an account. A blocked account cannot log in.
     */
    public function toggleBlock(Request $request, string $type, string $customerId): RedirectResponse
    {
        $customer = $this->resolveCustomer($type, $customerId);

        if ($request->user()->id === $customer->id) {
            return redirect()->back()->with('error', 'You cannot block your own account.');
        }

        $customer->update(['blocked' => ! (bool) $customer->blocked]);

        return redirect()->back()->with('success', $customer->blocked
            ? "{$customer->name} has been blocked and can no longer log in."
            : "{$customer->name} has been unblocked.");
    }

    /**
     * Superadmin: permanently delete any customer, agent or admin account.
     */
    public function destroy(Request $request, string $type, string $customerId): RedirectResponse
    {
        $customer = $this->resolveCustomer($type, $customerId);

        if ($request->user()->id === $customer->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        if ($type === 'admin' && $customer->role === 'superadmin'
            && Admin::where('role', 'superadmin')->count() <= 1) {
            return redirect()->back()->with('error', 'You cannot delete the last superadmin account.');
        }

        $name = $customer->name;

        DB::transaction(function () use ($type, $customer): void {
            match ($type) {
                'user' => $this->detachUserIdentity($customer),
                'agent' => $this->detachAgentIdentity($customer),
                'admin' => $this->detachAdminIdentity($customer),
                default => abort(404),
            };

            $customer->delete();
        });

        return redirect()->back()->with('success', "{$name} has been deleted.");
    }

    private function resolveCustomer(string $type, string $customerId): User|Agent|Admin
    {
        return match ($type) {
            'user' => User::findOrFail($customerId),
            'agent' => Agent::findOrFail($customerId),
            'admin' => Admin::findOrFail($customerId),
            default => abort(404),
        };
    }

    private function detachUserIdentity(User $user): void
    {
        DB::table('orders')->where('user_id', $user->id)->update(['user_id' => null]);
        DB::table('products')->where('user_id', $user->id)->update(['user_id' => null]);
        DB::table('stores')->where('user_id', $user->id)->update(['user_id' => null]);
    }

    private function detachAdminIdentity(Admin $admin): void
    {
        DB::table('orders')->where('user_id', $admin->id)->update(['user_id' => null]);
        DB::table('products')->where('user_id', $admin->id)->update(['user_id' => null]);
        DB::table('stores')->where('user_id', $admin->id)->update(['user_id' => null]);
    }

    private function detachAgentIdentity(Agent $agent): void
    {
        DB::table('stores')->where('agent_id', $agent->id)->update(['agent_id' => null]);
        DB::table('orders')->where('agent_id', $agent->id)->update(['agent_id' => null]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomersRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Customers $customers)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomersRequest $request, Customers $customers)
    {
        //
    }
}
