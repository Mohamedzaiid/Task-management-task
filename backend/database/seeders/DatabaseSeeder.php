<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create or retrieve admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'], // Check uniqueness by email
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Create or retrieve regular users
        $user1 = User::firstOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'jane@example.com'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        // 3. Create tasks (only if they don't exist to avoid duplicates on re-seed)
        // We'll simplistic check: if admin has tasks, assume tasks are seeded.
        
        if ($admin->tasks()->count() == 0) {
            Task::create([
                'user_id' => $admin->id,
                'title' => 'Setup project infrastructure',
                'description' => 'Configure servers, databases, and deployment pipelines.',
                'status' => 'completed',
            ]);
        }

        if ($user1->tasks()->count() == 0) {
            Task::create([
                'user_id' => $user1->id,
                'title' => 'Complete user documentation',
                'description' => 'Write comprehensive documentation for the user module.',
                'status' => 'in_progress',
            ]);

            Task::create([
                'user_id' => $user1->id,
                'title' => 'Fix login bug',
                'description' => 'Users report intermittent login failures.',
                'status' => 'pending',
            ]);

            Task::create([
                'user_id' => $user1->id,
                'title' => 'Update API endpoints',
                'description' => null,
                'status' => 'pending',
            ]);
        }

        if ($user2->tasks()->count() == 0) {
            Task::create([
                'user_id' => $user2->id,
                'title' => 'Design new dashboard',
                'description' => 'Create wireframes and mockups for the new analytics dashboard.',
                'status' => 'in_progress',
            ]);

            Task::create([
                'user_id' => $user2->id,
                'title' => 'Review pull requests',
                'description' => 'Review pending PRs from the team.',
                'status' => 'completed',
            ]);
        }
    }
}
