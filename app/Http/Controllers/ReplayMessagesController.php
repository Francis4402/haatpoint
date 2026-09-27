<?php

namespace App\Http\Controllers;

use App\Models\ReplayMessages;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateReplayMessagesRequest;
use Illuminate\Support\Facades\Auth;

class ReplayMessagesController extends Controller
{
    /**
     * Replies belonging to a single contact (route: contact.replies).
     */
    public function replies(string $contactId)
    {
        $replies = ReplayMessages::with(['user', 'admin'])
            ->where('contact_id', $contactId)
            ->oldest()
            ->get();

        return response()->json([
            'success' => true,
            'replies' => $replies,
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
    public function store(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'message' => 'required|string'
        ]);

        $reply = ReplayMessages::create([
            'user_id' => Auth::id(),
            'contact_id' => $request->contact_id,
            'message' => $request->message
        ]);


        $reply->load(['user', 'admin']);


        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'reply' => $reply,
                'message' => 'Reply sent successfully'
            ]);
        }

        return back()->with('success', 'Reply sent successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReplayMessagesRequest $request, ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReplayMessages $replayMessages)
    {
        //
    }
}
