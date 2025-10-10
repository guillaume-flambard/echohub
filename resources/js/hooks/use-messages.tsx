import axios from '@/bootstrap';
import { getAxiosErrorMessage } from '@/lib/error-utils';
import { useMatrixStore } from '@/stores/matrix';
import type { Contact, Message, MinervaResponse } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function useMessages(contact: Contact | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const matrixStore = useMatrixStore();

    const fetchHistory = useCallback(async () => {
        if (!contact) return;

        setLoading(true);
        setError(null);

        try {
            // For human contacts, use Matrix
            if (contact.type === 'human') {
                const matrixMessages = matrixStore.getMessages(
                    contact.matrix_id,
                );
                const formattedMessages: Message[] = matrixMessages.map(
                    (msg) => ({
                        role:
                            msg.sender === matrixStore.currentUserId
                                ? 'user'
                                : 'assistant',
                        content: msg.content,
                        timestamp: new Date(msg.timestamp).toISOString(),
                    }),
                );
                setMessages(formattedMessages);
            } else {
                // For app contacts, use API
                const response = await axios.get(
                    `/api/contacts/${contact.id}/messages`,
                );
                setMessages(response.data.history || []);
            }
        } catch (err: unknown) {
            setError(
                getAxiosErrorMessage(err) || 'Failed to fetch message history',
            );
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }, [contact, matrixStore]);

    const sendMessage = async (content: string): Promise<boolean> => {
        if (!contact || !content.trim()) return false;

        setSending(true);
        setError(null);

        try {
            // For human contacts, use Matrix
            if (contact.type === 'human') {
                await matrixStore.sendMessage(contact.matrix_id, content);

                // Add user message immediately
                const userMessage: Message = {
                    role: 'user',
                    content,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, userMessage]);
                return true;
            } else {
                // For app contacts, use API
                const response = await axios.post<MinervaResponse>(
                    `/api/contacts/${contact.id}/messages`,
                    { message: content },
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
            }
        } catch (err: unknown) {
            setError(getAxiosErrorMessage(err) || 'Failed to send message');
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
        } catch (err: unknown) {
            setError(getAxiosErrorMessage(err) || 'Failed to clear history');
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
    }, [contact, fetchHistory]);

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
