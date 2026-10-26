<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $query = Contact::query();
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->filter === 'unread') {
            $query->where('is_read', false);
        } elseif ($request->filter === 'starred') {
            $query->where('is_starred', true);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $contacts = $query->latest()->paginate(20);

        $unreadQuery = Contact::where('is_read', false);

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            $unreadQuery->where('user_id', $user->id);
        }

        $unreadCount = $unreadQuery->count();

        return Inertia::render('dashboard/messages/index', [
            'contacts' => $contacts,
            'unreadCount' => $unreadCount,
            'filters' => $request->only(['filter', 'search']),
        ]);
    }
}
