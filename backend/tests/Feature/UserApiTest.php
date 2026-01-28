<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    /** @test */
    public function admin_can_list_users(): void
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/users');

        $response->assertOk()
            ->assertJsonCount(2, 'data'); // admin + user
    }

    /** @test */
    public function regular_user_cannot_list_users(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/users');

        $response->assertForbidden();
    }

    /** @test */
    public function unauthenticated_user_cannot_list_users(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertUnauthorized();
    }
}
