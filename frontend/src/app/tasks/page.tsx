'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { useUsers } from '@/hooks/useUsers';
import { Task, CreateTaskData, UpdateTaskData } from '@/types';
import TaskList from '@/components/TaskList';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import DeleteConfirm from '@/components/DeleteConfirm';

import TaskDetailsModal from '@/components/TaskDetailsModal';

export default function TasksPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

    // Modal states
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else {
                fetchTasks();
            }
        }
    }, [isAuthenticated, authLoading, router, fetchTasks]);

    const handleCreate = async (data: CreateTaskData | UpdateTaskData) => {
        setIsSubmitting(true);
        try {
            await createTask(data as CreateTaskData);
            setShowForm(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: CreateTaskData | UpdateTaskData) => {
        if (!editingTask) return;
        setIsSubmitting(true);
        try {
            await updateTask(editingTask.id, data as UpdateTaskData);
            setEditingTask(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingTask) return;
        setIsSubmitting(true);
        try {
            await deleteTask(deletingTask.id);
            setDeletingTask(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (task: Task, status: Task['status']) => {
        try {
            await updateTask(task.id, { status });
        } catch {
            // handled in hook
        }
    };

    if (authLoading || (isLoading && tasks.length === 0)) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage and track your projects
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                    {error}
                </div>
            )}

            <TaskList
                tasks={tasks}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => setDeletingTask(task)}
                onView={(task) => setViewingTask(task)}
                onStatusChange={handleStatusChange}
                isLoading={isSubmitting}
            />

            {/* Task Details Modal */}
            {viewingTask && (
                <TaskDetailsModal
                    task={viewingTask}
                    onClose={() => setViewingTask(null)}
                />
            )}

            {/* Create task modal */}
            {showForm && (
                <TaskForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                    isLoading={isSubmitting}
                />
            )}

            {/* Edit task modal */}
            {editingTask && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingTask(null)}
                    isLoading={isSubmitting}
                />
            )}

            {/* Delete confirmation modal */}
            {deletingTask && (
                <DeleteConfirm
                    title="Delete Task"
                    message={`Are you sure you want to delete "${deletingTask.title}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingTask(null)}
                    isLoading={isSubmitting}
                />
            )}
        </DashboardLayout>
    );
}
