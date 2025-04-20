<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAllUser(){
        $all_user = User::all();
        
        return response()->json([
            'status' => 200,
            'all_user'  => $all_user,
        ]);
    }
}
