<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReplayMessages extends Model
{
    /** @use HasFactory<\Database\Factories\ReplayMessagesFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'contact_id',
        'message'
    ];

    protected $appends = ['author_name'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'user_id');
    }

    public function getAuthorNameAttribute()
    {
        if ($this->relationLoaded('user') && $this->user) {
            return $this->user->name;
        }

        if ($this->relationLoaded('admin') && $this->admin) {
            return $this->admin->name;
        }

        return 'Admin';
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}
