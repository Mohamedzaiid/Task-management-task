<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = User::where('email', 'john@example.com')->first();
$admin = User::where('email', 'admin@example.com')->first();

echo "User (" . $user->email . ") Role: " . $user->role . "\n";
echo "User isAdmin: " . ($user->isAdmin() ? 'YES' : 'NO') . "\n";
// Manually check canAccessPanel logic since we can't easily instantiate a Panel object here without more setup,
// but checking isAdmin is the core logic.
echo "User canAccessPanel (proxy via isAdmin): " . ($user->isAdmin() ? 'YES' : 'NO') . "\n";

echo "Admin (" . $admin->email . ") Role: " . $admin->role . "\n";
echo "Admin isAdmin: " . ($admin->isAdmin() ? 'YES' : 'NO') . "\n";
