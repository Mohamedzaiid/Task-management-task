<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     * Admin sees all tasks, regular users see only their own.
     */
    public function index(): AnonymousResourceCollection
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            $tasks = Task::with('user')->latest()->get();
        } else {
            $tasks = $user->tasks()->latest()->get();
        }

        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $user = Auth::user();
        $data = $request->validated();

        // Admin can assign to any user, regular users assign to self
        if (!$user->isAdmin() || !isset($data['user_id'])) {
            $data['user_id'] = $user->id;
        }

        // Set default status if not provided
        if (!isset($data['status'])) {
            $data['status'] = Task::STATUS_PENDING;
        }

        $task = Task::create($data);
        $task->load('user');

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): TaskResource
    {
        $this->authorize('view', $task);
        $task->load('user');

        return new TaskResource($task);
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $this->authorize('update', $task);

        $data = $request->validated();

        // If user is not admin, they can ONLY update the status.
        if (! $request->user()->isAdmin()) {
            $data = array_intersect_key($data, array_flip(['status']));
        }

        $task->update($data);
        $task->load('user');

        return new TaskResource($task);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }
}
