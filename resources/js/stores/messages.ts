import axios from '@/bootstrap';
import type { Contact, Message } from '@/types';
import { create } from 'zustand';

interface MessagesState {
    messages: Record<number, Message[]>; // contactId -> messages
    loading: Record<number, boolean>;
    sending: Record<number, boolean>;
    error: string | null;
    fetchHistory: (contact: Contact) => Promise<void>;
    sendMessage: (contact: Contact, content: string) => Promise<boolean>;
    clearHistory: (contact: Contact) => Promise<boolean>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
    messages: {},
    loading: {},
    sending: {},
    error: null,

    fetchHistory: async (contact) => {
        set((state) => ({
            loading: { ...state.loading, [contact.id]: true },
            error: null,
        }));

        try {
            const response = await axios.get(
                `/api/contacts/${contact.id}/messages`,
            );
            set((state) => ({
                messages: {
                    ...state.messages,
                    [contact.id]: response.data.history || [],
                },
                loading: { ...state.loading, [contact.id]: false },
            }));
        } catch {
            set((state) => ({
                error: 'Failed to fetch messages',
                loading: { ...state.loading, [contact.id]: false },
            }));
        }
    },

    sendMessage: async (contact, content) => {
        if (!content.trim()) return false;

        set((state) => ({
            sending: { ...state.sending, [contact.id]: true },
            error: null,
        }));

        try {
            const response = await axios.post(
                `/api/contacts/${contact.id}/messages`,
                {
                    message: content,
                },
            );

            if (response.data.success) {
                const currentMessages = get().messages[contact.id] || [];
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [contact.id]: [
                            ...currentMessages,
                            response.data.message,
                            response.data.response,
                        ],
                    },
                    sending: { ...state.sending, [contact.id]: false },
                }));
                return true;
            } else {
                set((state) => ({
                    error: response.data.error || 'Failed to send message',
                    sending: { ...state.sending, [contact.id]: false },
                }));
                return false;
            }
        } catch {
            set((state) => ({
                error: 'Failed to send message',
                sending: { ...state.sending, [contact.id]: false },
            }));
            return false;
        }
    },

    clearHistory: async (contact) => {
        try {
            await axios.delete(`/api/contacts/${contact.id}/messages`);
            set((state) => ({
                messages: { ...state.messages, [contact.id]: [] },
            }));
            return true;
        } catch {
            set({
                error: 'Failed to clear history',
            });
            return false;
        }
    },
}));
