<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use App\Rules\CleanText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $isSuperAdmin = $currentUser && $currentUser->role === 'superadmin';

        // Admins cannot see superadmins in customers/users list
        $admins = $isSuperAdmin
            ? Admin::all()
            : Admin::where('role', '!=', 'superadmin')->get();

        $customers = collect()
            ->merge(User::all())
            ->merge($admins)
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
     * Superadmin: promote a user or agent to the admin role.
     */
    public function promote(Request $request, string $type, string $customerId): RedirectResponse
    {
        if ($request->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized. Only superadmins can promote accounts to admin.');
        }

        $customer = $this->resolveCustomer($type, $customerId);

        return $this->executePromotion($customer);
    }

    /**
     * Legacy endpoint: promote a user to admin via single customer ID parameter.
     */
    public function promoteLegacy(string $customerId): RedirectResponse
    {
        if (request()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized. Only superadmins can promote accounts to admin.');
        }

        $customer = User::find($customerId) ?? Agent::findOrFail($customerId);

        return $this->executePromotion($customer);
    }

    private function executePromotion(User|Agent|Admin $customer): RedirectResponse
    {
        // Superadmin role cannot be changed
        if ($customer->role === 'superadmin') {
            return redirect()->back()->with('error', 'Superadmin role cannot be changed.');
        }

        if ($customer instanceof Admin || Admin::where('email', $customer->email)->exists()) {
            return redirect()->back()->with('error', "{$customer->name} is already an admin.");
        }

        DB::transaction(function () use ($customer) {
            // Copy the user's/agent's password hash verbatim. Admin has a 'hashed' cast,
            // so mass-assigning would double-hash it and break login.
            DB::table('admins')->insert([
                'id' => (string) Str::uuid(),
                'name' => $customer->name,
                'email' => $customer->email,
                'password' => $customer->password,
                'role' => 'admin',
                'images' => $customer->images,
                'google_id' => $customer->google_id ?? null,
                'provider' => $customer->provider ?? null,
                'provider_id' => $customer->provider_id ?? null,
                'email_verified_at' => $customer->email_verified_at,
                'blocked' => (bool) $customer->blocked,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // The promoted account no longer exists as a customer/agent: detach its
            // business data (orders/products/stores) so it survives the delete.
            if ($customer instanceof User) {
                DB::table('orders')->where('user_id', $customer->id)->update(['user_id' => null]);
                DB::table('products')->where('user_id', $customer->id)->update(['user_id' => null]);
                DB::table('stores')->where('user_id', $customer->id)->update(['user_id' => null]);
            } elseif ($customer instanceof Agent) {
                DB::table('stores')->where('agent_id', $customer->id)->update(['agent_id' => null]);
                DB::table('orders')->where('agent_id', $customer->id)->update(['agent_id' => null]);
                DB::table('products')->where('user_id', $customer->id)->update(['user_id' => null]);
            }

            $customer->delete();
        });

        return redirect()->back()->with('success', "{$customer->name} has been promoted to admin.");
    }

    /**
     * Convert a user or admin to an agent.
     * - user -> agent: allowed for superadmin and admin.
     * - admin -> agent: allowed for superadmin ONLY.
     * - superadmin role can NEVER be changed!
     */
    public function makeAgent(Request $request, string $type, string $customerId): RedirectResponse
    {
        $customer = $this->resolveCustomer($type, $customerId);

        if ($customer->role === 'superadmin') {
            return redirect()->back()->with('error', 'Superadmin role cannot be changed.');
        }

        if ($type === 'admin') {
            if ($request->user()->role !== 'superadmin') {
                abort(403, 'Unauthorized. Only superadmins can convert an administrator to an agent.');
            }

            if (Agent::where('email', $customer->email)->exists()) {
                return redirect()->back()->with('error', "{$customer->name} is already an agent.");
            }

            DB::transaction(function () use ($customer) {
                $agentId = (string) Str::uuid();

                DB::table('agents')->insert([
                    'id' => $agentId,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'password' => $customer->password,
                    'role' => 'agent',
                    'images' => $customer->images,
                    'email_verified_at' => $customer->email_verified_at,
                    'blocked' => (bool) $customer->blocked,
                    'plan' => 'free',
                    'subscription_ends_at' => now()->addYear(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('stores')->where('user_id', $customer->id)->update([
                    'user_id' => null,
                    'agent_id' => $agentId,
                ]);
                DB::table('orders')->where('user_id', $customer->id)->update(['user_id' => null]);
                DB::table('products')->where('user_id', $customer->id)->update(['user_id' => null]);

                $customer->delete();
            });

            return redirect()->back()->with('success', "{$customer->name} has been converted from admin to agent.");
        }

        if (Agent::where('email', $customer->email)->exists()) {
            return redirect()->back()->with('error', "{$customer->name} is already an agent.");
        }

        DB::transaction(function () use ($customer) {
            $agentId = (string) Str::uuid();

            DB::table('agents')->insert([
                'id' => $agentId,
                'name' => $customer->name,
                'email' => $customer->email,
                'password' => $customer->password,
                'role' => 'agent',
                'images' => $customer->images,
                'email_verified_at' => $customer->email_verified_at,
                'blocked' => (bool) $customer->blocked,
                'plan' => 'free',
                'subscription_ends_at' => now()->addYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('stores')->where('user_id', $customer->id)->update([
                'user_id' => null,
                'agent_id' => $agentId,
            ]);
            DB::table('orders')->where('user_id', $customer->id)->update(['user_id' => null]);
            DB::table('products')->where('user_id', $customer->id)->update(['user_id' => null]);

            $customer->delete();
        });

        return redirect()->back()->with('success', "{$customer->name} is now an agent.");
    }

    /**
     * Legacy endpoint for user -> agent conversion.
     */
    public function makeAgentLegacy(User $user): RedirectResponse
    {
        return $this->makeAgent(request(), 'user', $user->id);
    }

    /**
     * An agent cannot become a user. Admin/Superadmin too.
     */
    public function makeUser(Agent $agent): RedirectResponse
    {
        return redirect()->back()->with('error', 'Agents, admins, and superadmins cannot become customers.');
    }

    /**
     * Superadmin: block/unblock an account. A blocked account cannot log in.
     */
    public function toggleBlock(Request $request, string $type, string $customerId): RedirectResponse
    {
        $customer = $this->resolveCustomer($type, $customerId);

        if ($customer->role === 'superadmin') {
            return redirect()->back()->with('error', 'Superadmin accounts cannot be blocked.');
        }

        if ($type === 'admin' && $request->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized. Admins cannot block administrator accounts.');
        }

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

        if ($customer->role === 'superadmin') {
            return redirect()->back()->with('error', 'Superadmin accounts cannot be deleted.');
        }

        if ($type === 'admin' && $request->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized. Admins cannot delete administrator accounts.');
        }

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
                'agent' => $this->deleteAgentWithStoresAndProducts($customer),
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
        $this->deleteFileSafely($user->images);
    }

    private function detachAdminIdentity(Admin $admin): void
    {
        DB::table('orders')->where('user_id', $admin->id)->update(['user_id' => null]);
        DB::table('products')->where('user_id', $admin->id)->update(['user_id' => null]);
        DB::table('stores')->where('user_id', $admin->id)->update(['user_id' => null]);
        $this->deleteFileSafely($admin->images);
    }

    /**
     * Delete an agent along with all their stores, products, and associated images from disk.
     */
    private function deleteAgentWithStoresAndProducts(Agent $agent): void
    {
        // 1. Detach buyer orders where agent was the customer
        DB::table('orders')->where('agent_id', $agent->id)->update(['agent_id' => null]);

        // 2. Find and delete all stores belonging to this agent (with their products & images)
        $stores = Store::where('agent_id', $agent->id)->get();
        foreach ($stores as $store) {
            $this->deleteStore($store);
        }

        // 3. Clean up any orphaned products directly created by this agent
        $orphanedProducts = Products::where('user_id', $agent->id)->get();
        foreach ($orphanedProducts as $product) {
            $this->deleteProductImages($product);
            $product->delete();
        }

        // 4. Delete the agent avatar image
        $this->deleteFileSafely($agent->images);
    }

    /**
     * Delete a store along with its logo, products, and product images.
     */
    private function deleteStore(Store $store): void
    {
        // Delete store logo from disk
        $this->deleteFileSafely($store->logo);

        // Delete all products belonging to this store and their images from disk
        $products = Products::where('store_id', $store->id)->get();
        foreach ($products as $product) {
            $this->deleteProductImages($product);
            $product->delete();
        }

        // Delete the store record
        $store->delete();
    }

    /**
     * Delete all images belonging to a product from public disk storage.
     */
    private function deleteProductImages(Products $product): void
    {
        if (!$product->images) {
            return;
        }

        $images = json_decode($product->images, true);

        if (is_array($images)) {
            foreach ($images as $imagePath) {
                if (is_string($imagePath)) {
                    $this->deleteFileSafely($imagePath);
                }
            }
        } elseif (is_string($product->images)) {
            $this->deleteFileSafely($product->images);
        }
    }

    /**
     * Safely delete a file from the public storage disk.
     */
    private function deleteFileSafely(?string $path): void
    {
        if (!$path) {
            return;
        }

        $cleanPath = ltrim(str_replace(['/storage/', storage_path('app/public/')], '', $path), '/');

        if ($cleanPath !== '' && Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }
    }

    /**
     * Update customer / agent / admin profile information.
     */
    public function update(Request $request, string $type, string $customerId): RedirectResponse
    {
        $customer = $this->resolveCustomer($type, $customerId);

        if ($type === 'admin') {
            if ($request->user()->role !== 'superadmin') {
                abort(403, 'Unauthorized. Admins cannot update administrator accounts.');
            }
        }

        if ($type === 'agent') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', new CleanText],
                'email' => ['required', 'email', 'max:255', Rule::unique('agents')->ignore($customer->id)],
                'mobile' => ['nullable', 'string', 'regex:/^01[3-9]\d{8}$/', Rule::unique('agents')->ignore($customer->id)],
                'national_id' => ['nullable', 'string', 'regex:/^\d{10}$|^\d{17}$/', Rule::unique('agents')->ignore($customer->id)],
                'address' => ['nullable', 'string', 'max:1000', new CleanText],
                'plan' => ['nullable', 'in:free,pro'],
            ]);

            if (isset($validated['plan']) && $validated['plan'] === 'pro' && $customer->plan !== 'pro') {
                $validated['subscription_ends_at'] = now()->addYear();
            }

            $customer->update($validated);
        } elseif ($type === 'user') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', new CleanText],
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($customer->id),
                    function ($attribute, $value, $fail) {
                        if (Agent::where('email', $value)->exists()) {
                            $fail('This email belongs to an agent and cannot be assigned to a customer.');
                        }
                        if (Admin::where('email', $value)->exists()) {
                            $fail('This email belongs to an administrator and cannot be assigned to a customer.');
                        }
                    },
                ],
                'mobile' => ['nullable', 'string', 'regex:/^01[3-9]\d{8}$/'],
                'phone' => ['nullable', 'string', 'regex:/^01[3-9]\d{8}$/'],
                'address' => ['nullable', 'string', 'max:1000', new CleanText],
            ]);

            if (isset($validated['mobile']) && !isset($validated['phone'])) {
                $validated['phone'] = $validated['mobile'];
            }

            $customer->update($validated);
        } elseif ($type === 'admin') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', new CleanText],
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('admins')->ignore($customer->id),
                    function ($attribute, $value, $fail) {
                        if (Agent::where('email', $value)->exists()) {
                            $fail('This email belongs to an agent and cannot be assigned to an administrator.');
                        }
                        if (User::where('email', $value)->exists()) {
                            $fail('This email belongs to a customer and cannot be assigned to an administrator.');
                        }
                    },
                ],
            ]);

            // Superadmin role cannot be changed by anyone
            unset($validated['role']);

            $customer->update($validated);
        }

        return redirect()->back()->with('success', "{$customer->name}'s profile has been updated successfully.");
    }
}
