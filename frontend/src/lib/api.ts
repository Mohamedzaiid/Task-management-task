import { LoginResponse, TasksResponse, TaskResponse, CreateTaskData, UpdateTaskData, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (response.status === 401) {
            this.setToken(null);
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Unauthorized');
        }

        if (response.status === 204) {
            return {} as T;
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(response.data.token);
        return response;
    }

    async logout(): Promise<void> {
        await this.request<void>('/auth/logout', {
            method: 'POST',
        });
        this.setToken(null);
    }

    async me(): Promise<{ data: User }> {
        return this.request<{ data: User }>('/auth/me');
    }

    // Task endpoints
    async getTasks(): Promise<TasksResponse> {
        return this.request<TasksResponse>('/tasks');
    }

    async getTask(id: number): Promise<TaskResponse> {
        return this.request<TaskResponse>(`/tasks/${id}`);
    }

    async createTask(data: CreateTaskData): Promise<TaskResponse> {
        return this.request<TaskResponse>('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTask(id: number, data: UpdateTaskData): Promise<TaskResponse> {
        return this.request<TaskResponse>(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteTask(id: number): Promise<void> {
        return this.request<void>(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }

    // User endpoints (Admin only)
    async getUsers(): Promise<{ data: User[] }> {
        return this.request<{ data: User[] }>('/users');
    }

    async createUser(data: { name: string; email: string; password: string; password_confirmation: string; role: 'admin' | 'user' }): Promise<void> {
        return this.request<void>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateUser(id: number, data: { name: string; email: string; role: 'admin' | 'user'; password?: string; password_confirmation?: string }): Promise<void> {
        return this.request<void>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteUser(id: number): Promise<void> {
        return this.request<void>(`/users/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiClient();
