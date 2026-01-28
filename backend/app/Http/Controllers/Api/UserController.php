<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validated();

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
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('create', User::class); 

        $validated = $request->validated();

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
        $this->authorize('create', User::class);

        $user->delete();

        return response()->json([], 204);
    }
}
