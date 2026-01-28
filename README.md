# Task Management System

Full-stack application for managing tasks and users with Role-Based Access Control (RBAC).

## Repository Structure
- **`/backend`**: Laravel 10 API + Filament Admin Panel.
- **`/frontend`**: Next.js 14 Client Application.

## Technology Stack
- **Backend**: Laravel 10, MySQL, Sanctum, Filament v3.
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **Database**: MySQL 8.

## Getting Started

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Configure DB_CONNECTION=mysql in .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Access Credentials
**Admin**: `admin@example.com` / `password`  
**User**: `john@example.com` / `password`
