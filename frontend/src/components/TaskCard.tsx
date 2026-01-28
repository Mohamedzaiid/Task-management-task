'use client';

import { Task } from '@/types';
import StatusDropdown from './StatusDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onView: (task: Task) => void;
    onStatusChange: (task: Task, status: Task['status']) => void;
    isLoading?: boolean;
}

export default function TaskCard({
    task,
    onEdit,
    onDelete,
    onView,
    onStatusChange,
    isLoading,
}: TaskCardProps) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col group">
            <div className="p-5 flex-1 cursor-pointer" onClick={() => onView(task)}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={task.title}>
                        {task.title}
                    </h3>
                    <div onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                            status={task.status}
                            onChange={(status) => onStatusChange(task, status)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {task.description ? (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {task.description}
                    </p>
                ) : (
                    <p className="text-gray-400 text-sm mb-4 italic">No description</p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex flex-col gap-1">
                        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                        {isAdmin && task.user && (
                            <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
                                {task.user.name}
                            </span>
                        )}
                        {isAdmin && !task.user && (
                            <span className="text-gray-400">Unassigned</span>
                        )}
                    </div>
                    <span className="hidden group-hover:block text-indigo-600 font-medium">View Details →</span>
                </div>
            </div>

            {isAdmin && (
                <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(task)}
                        disabled={isLoading}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(task)}
                        disabled={isLoading}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
