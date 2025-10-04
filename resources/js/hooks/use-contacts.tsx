import { useEffect, useState } from 'react';
import axios from '@/bootstrap';
import type { Contact } from '@/types';

export function useContacts(type?: 'app' | 'human') {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = type ? { type } : {};
            const response = await axios.get('/api/contacts', { params });
            setContacts(response.data.contacts);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch contacts');
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [type]);

    return {
        contacts,
        loading,
        error,
        refetch: fetchContacts,
    };
}
