import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.getUsers();
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createUser = async (data: any) => {
        try {
            await api.createUser(data);
            await fetchUsers();
        } catch (err) {
            throw err;
        }
    };

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        createUser,
    };
}
