import AppLayout from '@/layouts/app-layout';
import { ChatView } from '@/components/hub/chat-view';
import { ContactList } from '@/components/hub/contact-list';
import { useContactsStore } from '@/stores/contacts';
import { useMessagesStore } from '@/stores/messages';
import { type BreadcrumbItem, type Contact } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { hub } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hub',
        href: hub().url,
    },
];

export default function Hub() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Zustand stores
    const { contacts, loading: contactsLoading, error: contactsError, fetchContacts } = useContactsStore();
    const { messages, loading, sending, error: messagesError, fetchHistory, sendMessage, clearHistory } = useMessagesStore();

    // Fetch contacts on mount
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // Fetch messages when contact changes
    useEffect(() => {
        if (selectedContact) {
            fetchHistory(selectedContact);
        }
    }, [selectedContact, fetchHistory]);

    const currentMessages = selectedContact ? messages[selectedContact.id] || [] : [];
    const messagesLoading = selectedContact ? loading[selectedContact.id] || false : false;
    const isSending = selectedContact ? sending[selectedContact.id] || false : false;

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
    };

    const handleSendMessage = async (content: string) => {
        if (!selectedContact) return false;
        return await sendMessage(selectedContact, content);
    };

    const handleClearHistory = async () => {
        if (!selectedContact) return false;

        const confirmed = window.confirm(
            'Are you sure you want to clear the conversation history? This action cannot be undone.'
        );

        if (confirmed) {
            return await clearHistory(selectedContact);
        }
        return false;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hub" />

            <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                {/* Contact List Sidebar */}
                <div className="w-80 border-r border-sidebar-border bg-card">
                    <ContactList
                        contacts={contacts}
                        selectedContact={selectedContact}
                        onSelectContact={handleSelectContact}
                        loading={contactsLoading}
                        error={contactsError}
                    />
                </div>

                {/* Chat View */}
                <div className="flex-1 bg-background">
                    <ChatView
                        contact={selectedContact}
                        messages={currentMessages}
                        loading={messagesLoading}
                        sending={isSending}
                        error={messagesError}
                        onSendMessage={handleSendMessage}
                        onClearHistory={handleClearHistory}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
