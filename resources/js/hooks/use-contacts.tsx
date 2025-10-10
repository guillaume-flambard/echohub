import axios from '@/bootstrap';
import { getErrorMessage } from '@/lib/error-utils';
import type { Contact } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useContacts(type?: 'app' | 'human') {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = type ? { type } : {};
            const response = await axios.get('/api/contacts', { params });
            setContacts(response.data.contacts);
        } catch (err: unknown) {
            setError(getErrorMessage(err) || 'Failed to fetch contacts');
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return {
        contacts,
        loading,
        error,
        refetch: fetchContacts,
    };
}
