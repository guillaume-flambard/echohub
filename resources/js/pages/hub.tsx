import AppLayout from '@/layouts/app-layout';
import { ChatView } from '@/components/hub/chat-view';
import { ContactList } from '@/components/hub/contact-list';
import { useContacts } from '@/hooks/use-contacts';
import { useMessages } from '@/hooks/use-messages';
import { type BreadcrumbItem, type Contact } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { hub } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hub',
        href: hub().url,
    },
];

export default function Hub() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const { contacts, loading: contactsLoading } = useContacts();
    const { messages, loading: messagesLoading, sending, sendMessage, clearHistory } =
        useMessages(selectedContact);

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
    };

    const handleClearHistory = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to clear the conversation history? This action cannot be undone.'
        );

        if (confirmed) {
            await clearHistory();
        }
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
                    />
                </div>

                {/* Chat View */}
                <div className="flex-1 bg-background">
                    <ChatView
                        contact={selectedContact}
                        messages={messages}
                        loading={messagesLoading}
                        sending={sending}
                        onSendMessage={sendMessage}
                        onClearHistory={handleClearHistory}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
