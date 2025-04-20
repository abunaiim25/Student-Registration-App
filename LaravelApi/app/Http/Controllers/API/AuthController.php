<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AcademicInfo;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    //----------REGISTER----------
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email'    => 'required|email:191|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'dob' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'courses' => 'required|json',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ], 422);
        } else {
            // Save image if exists
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('img_DB/images/'), $filename);
                $imagePath =  $filename;
            }

            $user = User::create([
                'full_name' => $request->full_name,
                'dob'       => $request->dob,
                'email'     => $request->email,
                'street'    => $request->street,
                'city'      => $request->city,
                'state'     => $request->state,
                'country'   => $request->country,
                'zip'       => $request->zip,
                'image'     => $imagePath,
                'password' => Hash::make($request->password),
            ]);

            $courses = json_decode($request->courses, true);
            foreach ($courses as $course) {
                $info = AcademicInfo::create([
                    'user_id'     => $user->id,
                    'examination' => $course['examination'] ?? '',
                    'group'       => $course['group'] ?? '',
                    'result'      => $course['result'] ?? '',
                    'passing'     => $course['passing'] ?? '',
                ]);
                Log::info('Academic Info created:', ['info' => $info]);
            }

            $token = $user->createToken($user->email . '_Token')->plainTextToken;

            return response()->json([
                'status'   => 200,
                'full_name' => $user->full_name,
                'token'    => $token,
                'message' => 'Student registered successfully!',
            ]);
        }
    }


    //----------LOGIN----------
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status'  => 401,
                    'message' => 'Invalid Credentials',
                ]);
            } else {
                if ($user->role_as == 1) //1 = admin
                {
                    $role  = 'admin';
                    $token = $user->createToken($user->email . '_AdminToken', ['server:admin'])->plainTextToken;
                } else {
                    $role  = '';
                    $token = $user->createToken($user->email . '_Token', [''])->plainTextToken;
                }
                return response()->json([
                    'status'   => 200,
                    'full_name' => $user->full_name,
                    'token'    => $token,
                    'message'  => 'Logged In Successfully',
                    'role'     => $role,
                ]);
            }
        }
    }


    //----------USER----------
    // public function me(Request $request)
    // {
    //     return $request->user();
    // }


    //----------LOGOUT----------
    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'  => 200,
            'message' => 'Logged Out Successfully',
        ]);
    }
}
