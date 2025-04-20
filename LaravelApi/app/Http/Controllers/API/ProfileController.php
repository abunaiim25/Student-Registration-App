<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;


class ProfileController extends Controller
{
    //----------USER----------
    public function me(Request $request)
    {
        $user = Auth::user()->load('academicInfos'); // eager load relationship

        return response()->json([
            'user' => $user,
        ]);
    }


    //----------UPDATE PROFILE----------
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'courses' => 'required|json',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'zip' => 'nullable|string|max:20',
        ]);

        if ($request->hasFile('image')) {
            // Check if the existing image exists and delete it
            if (!empty($user->image)) {
                $oldImagePath = public_path('img_DB/images/' . $user->image);
                if (File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }
            }
            // Upload the new image
            $file = $request->file('image');
            $ext = $file->getClientOriginalExtension();
            $filename = time() . '.' . $ext;
            $file->move(public_path('img_DB/images/'), $filename);
            // Save only the filename in the database
            $user->image = $filename;
        }

        $user->update([
            'full_name' => $validated['full_name'],
            'dob' => $validated['dob'],
            'street' => $validated['street'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'country' => $validated['country'],
            'zip' => $validated['zip'],
        ]);

        $user->academicInfos()->delete(); // clear old data

        $courses = json_decode($validated['courses'], true);
        foreach ($courses as $course) {
            $user->academicInfos()->create($course);
        }

        return response()->json(['status' => 200, 'message' => 'Profile updated successfully']);
    }
}
