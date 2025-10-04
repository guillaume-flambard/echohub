import { create } from 'zustand';
import axios from '@/bootstrap';
import type { Contact } from '@/types';

interface ContactsState {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    fetchContacts: (type?: 'app' | 'human') => Promise<void>;
}

export const useContactsStore = create<ContactsState>((set) => ({
    contacts: [],
    loading: false,
    error: null,

    fetchContacts: async (type) => {
        set({ loading: true, error: null });
        try {
            const params = type ? { type } : {};
            const response = await axios.get('/api/contacts', { params });
            set({ contacts: response.data.contacts, loading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch contacts',
                loading: false,
            });
        }
    },
}));
