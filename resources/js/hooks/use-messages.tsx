import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Contact, Message, MinervaResponse } from '@/types';

export function useMessages(contact: Contact | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        if (!contact) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/contacts/${contact.id}/messages`);
            setMessages(response.data.history || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch message history');
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string): Promise<boolean> => {
        if (!contact || !content.trim()) return false;

        setSending(true);
        setError(null);

        try {
            const response = await axios.post<MinervaResponse>(
                `/api/contacts/${contact.id}/messages`,
                { message: content }
            );

            if (response.data.success) {
                // Add both user message and AI response to the list
                setMessages((prev) => [
                    ...prev,
                    response.data.message,
                    response.data.response,
                ]);
                return true;
            } else {
                setError(response.data.error || 'Failed to send message');
                return false;
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to send message');
            console.error('Error sending message:', err);
            return false;
        } finally {
            setSending(false);
        }
    };

    const clearHistory = async (): Promise<boolean> => {
        if (!contact) return false;

        try {
            await axios.delete(`/api/contacts/${contact.id}/messages`);
            setMessages([]);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to clear history');
            console.error('Error clearing history:', err);
            return false;
        }
    };

    useEffect(() => {
        if (contact) {
            fetchHistory();
        } else {
            setMessages([]);
        }
    }, [contact?.id]);

    return {
        messages,
        loading,
        sending,
        error,
        sendMessage,
        clearHistory,
        refetch: fetchHistory,
    };
}
