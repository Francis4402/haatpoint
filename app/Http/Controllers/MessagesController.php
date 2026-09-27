<?php

namespace App\Http\Controllers;

use App\Models\Messages;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMessagesRequest;
use App\Http\Requests\UpdateMessagesRequest;
use App\Models\Contact;
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
    public function store(StoreMessagesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Messages $messages)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Messages $messages)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMessagesRequest $request, Messages $messages)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Messages $messages)
    {
        //
    }
}
