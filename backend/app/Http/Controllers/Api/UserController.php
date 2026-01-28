<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Get list of users (Admin only).
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $users = User::select('id', 'name', 'email', 'role')->get();

        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Create a new user (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:admin,user'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'data' => $user,
        ], 201);
    }

    /**
     * Update a user (Admin only).
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('create', User::class); // Re-use create policy (admin check) or duplicate logic

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'confirmed', Rules\Password::defaults()],
            'role' => ['sometimes', 'required', 'in:admin,user'],
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Delete a user (Admin only).
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('create', User::class); // Admin check

        $user->delete();

        return response()->json([], 204);
    }
}
