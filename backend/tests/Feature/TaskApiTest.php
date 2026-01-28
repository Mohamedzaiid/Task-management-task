<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $user;
    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
        $this->otherUser = User::factory()->create(['role' => 'user']);
    }

    /** @test */
    public function user_can_get_their_own_tasks(): void
    {
        $userTask = Task::create([
            'user_id' => $this->user->id,
            'title' => 'User Task',
            'status' => 'pending',
        ]);

        Task::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Task',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $userTask->id);
    }

    /** @test */
    public function admin_can_get_all_tasks(): void
    {
        Task::create([
            'user_id' => $this->user->id,
            'title' => 'User Task',
            'status' => 'pending',
        ]);

        Task::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Task',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function user_can_create_a_task(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'New Task')
            ->assertJsonPath('data.user_id', $this->user->id);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function user_can_update_their_own_task(): void
    {
        $task = Task::create([
            'user_id' => $this->user->id,
            'title' => 'Original Title',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated Title',
            'status' => 'in_progress',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Updated Title')
            ->assertJsonPath('data.status', 'in_progress');
    }

    /** @test */
    public function user_cannot_update_another_users_task(): void
    {
        $task = Task::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Task',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Hacked Title',
        ]);

        $response->assertForbidden();
    }

    /** @test */
    public function user_can_delete_their_own_task(): void
    {
        $task = Task::create([
            'user_id' => $this->user->id,
            'title' => 'Task to Delete',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function user_cannot_delete_another_users_task(): void
    {
        $task = Task::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Other User Task',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function admin_can_update_any_task(): void
    {
        $task = Task::create([
            'user_id' => $this->user->id,
            'title' => 'User Task',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->admin);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Admin Updated Title',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Admin Updated Title');
    }

    /** @test */
    public function task_requires_title(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/tasks', [
            'description' => 'No title provided',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    /** @test */
    public function task_status_must_be_valid(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'status' => 'invalid_status',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_tasks(): void
    {
        $response = $this->getJson('/api/tasks');

        $response->assertUnauthorized();
    }
}
