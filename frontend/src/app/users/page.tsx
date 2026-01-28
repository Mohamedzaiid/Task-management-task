'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import DeleteConfirm from '@/components/DeleteConfirm';
import { User } from '@/types';
import { api } from '@/lib/api';

export default function UsersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { users, isLoading, error, fetchUsers } = useUsers();

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null); // Note: UserForm needs update to handle edit
    // Current UserForm is create-only. I will need to update UserForm or create EditUserForm.
    // For now, I'll update UserForm to handle edits in next steps if needed, 
    // but UserForm prop only has onSuccess/onCancel. I should pass initialData.
    // Let's assume I will update UserForm to accept `initialData`.

    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else if (user?.role !== 'admin') {
                router.replace('/tasks');
            } else {
                fetchUsers();
            }
        }
    }, [isAuthenticated, authLoading, user, router, fetchUsers]);

    const handleDelete = async () => {
        if (!deletingUser) return;
        setIsSubmitting(true);
        try {
            await api.deleteUser(deletingUser.id);
            await fetchUsers();
            setDeletingUser(null);
        } catch (e) {
            alert('Failed to delete user');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoading && users.length === 0) {
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage system access and roles</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <UserList
                users={users}
                onEdit={(u) => {
                    setEditingUser(u);
                    setShowForm(true);
                }}
                onDelete={(u) => setDeletingUser(u)}
                isLoading={isSubmitting}
            />

            {/* Create/Edit Modal */}
            {showForm && (
                <UserForm
                    user={editingUser}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingUser(null);
                        fetchUsers();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingUser(null);
                    }}
                />
            )}

            {/* Delete Modal */}
            {deletingUser && (
                <DeleteConfirm
                    title="Delete User"
                    message={`Are you sure you want to delete "${deletingUser.name}"? This will also delete all their tasks.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingUser(null)}
                    isLoading={isSubmitting}
                />
            )}

        </DashboardLayout>
    );
}
