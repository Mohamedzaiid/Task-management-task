# Task Management System

A robust, full-stack Task Management System using **Laravel** (Backend) and **Next.js** (Frontend).
Includes a powerful Admin Panel via **Filament** and a separation of concerns for user tasks vs. admin management.

## Tech Stack
- **Backend**: Laravel 10+, MySQL, Sanctum (Auth), Filament v3 (Admin Panel).
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS v4.

## Features
- **Authentication**: Secure Login/Logout with Sanctum.
- **Task Management**:
    - Dashboard view with modern Card layout.
    - Create/Update/Delete tasks (RBAC protected).
    - Status tracking (Pending, In Progress, Completed).
- **User Management (Admin Only)**:
    - Dedicated `/users` page for managing system access.
    - Create/Edit/Delete users.
    - Assign ROLES (Admin/User).
- **Admin Panel**:
    - Full Filament admin dashboard at `/admin`.

## Architecture
- **Separation of Concerns**:
    - **Tasks** are managed in `src/app/tasks`.
    - **Users** are managed in `src/app/users`.
    - **Layout**: Shared `DashboardLayout` for consistent sidebar navigation.
    - **Hooks**: Logic encapsulated in `useTasks` and `useUsers` custom hooks.

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL Server

## Setup Instructions

### 1. Backend Setup
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    composer install
    ```
3.  Configure Environment:
    ```bash
    cp .env.example .env
    ```
    - Update `.env` with your **MySQL** credentials:
      ```
      DB_CONNECTION=mysql
      DB_HOST=127.0.0.1
      DB_PORT=3306
      DB_DATABASE=task_management
      DB_USERNAME=root
      DB_PASSWORD=your_password
      ```
4.  Generate Key & Migrate:
    ```bash
    php artisan key:generate
    php artisan migrate --seed
    ```
5.  Serve:
    ```bash
    php artisan serve
    ```

### 2. Frontend Setup
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    ```bash
    cp .env.example .env.local
    ```
4.  Run Development Server:
    ```bash
    npm run dev
    ```

## Usage
- **Admin**: Log in with `admin@example.com` / `password`.
    - Access `/tasks` to manage tasks.
    - Access `/users` to manage users.
- **Regular User**: Log in with `john@example.com` / `password`.
    - Access `/tasks` (read-only except for creating new tasks).

## API Documentation
Import `postman_collection.json` into Postman for full API testing.
