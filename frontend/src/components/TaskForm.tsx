'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Task['status']>('pending');
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setUserId(task.user_id);
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
            setUserId(undefined);
        }
    }, [task]);

    // Fetch users if admin
    useEffect(() => {
        if (isAdmin) {
            api.getUsers()
                .then(response => setUsers(response.data))
                .catch(console.error);
        }
    }, [isAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            const data: CreateTaskData | UpdateTaskData = {
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                user_id: userId,
            };
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save task');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {task ? 'Edit Task' : 'Create Task'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="What needs to be done?"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                            placeholder="Add details about this task..."
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <div className="relative">
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Task['status'])}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all"
                                disabled={isLoading}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div>
                            <label htmlFor="user" className="block text-sm font-semibold text-gray-700 mb-2">
                                Assign To
                            </label>
                            <div className="relative">
                                <select
                                    id="user"
                                    value={userId || ''}
                                    onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all"
                                    disabled={isLoading}
                                >
                                    <option value="">(Myself)</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-medium shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70"
                        >
                            {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
