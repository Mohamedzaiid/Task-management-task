'use client';

import { Task } from '@/types';
import TaskCard from './TaskCard';

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onView: (task: Task) => void;
    onStatusChange: (task: Task, status: Task['status']) => void;
    isLoading?: boolean;
}

export default function TaskList({
    tasks,
    onEdit,
    onDelete,
    onView,
    onStatusChange,
    isLoading,
}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="h-8 w-8 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onStatusChange={onStatusChange}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
}
