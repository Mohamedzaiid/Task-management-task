import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Task, CreateTaskData, UpdateTaskData } from '@/types';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.getTasks();
            setTasks(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = async (data: CreateTaskData | UpdateTaskData) => {
        try {
            await api.createTask(data as CreateTaskData);
            await fetchTasks();
        } catch (err) {
            throw err;
        }
    };

    const updateTask = async (id: number, data: CreateTaskData | UpdateTaskData) => {
        try {
            await api.updateTask(id, data as UpdateTaskData);
            await fetchTasks();
        } catch (err) {
            throw err;
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await api.deleteTask(id);
            await fetchTasks();
        } catch (err) {
            throw err;
        }
    };

    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
    };
}
