'use client';

import { Task } from '@/types';

interface StatusDropdownProps {
    status: Task['status'];
    onChange: (status: Task['status']) => void;
    disabled?: boolean;
}

const statusOptions: { value: Task['status']; label: string; color: string; dotColor: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100', dotColor: 'bg-yellow-400' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', dotColor: 'bg-blue-400' },
    { value: 'completed', label: 'Completed', color: 'bg-green-50 text-green-700 hover:bg-green-100', dotColor: 'bg-green-400' },
];

export default function StatusDropdown({ status, onChange, disabled }: StatusDropdownProps) {
    const currentOption = statusOptions.find(opt => opt.value === status);

    return (
        <div className="relative inline-block">
            <select
                value={status}
                onChange={(e) => onChange(e.target.value as Task['status'])}
                disabled={disabled}
                className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-0 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all uppercase tracking-wide ${currentOption?.color || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${currentOption?.dotColor}`}></div>
        </div>
    );
}
