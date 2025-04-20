<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicInfo extends Model
{
    protected $fillable = [
        'user_id', 'examination', 'group', 'result', 'passing'
    ];

    public function student()
    {
        return $this->belongsTo(User::class);
    }
}
