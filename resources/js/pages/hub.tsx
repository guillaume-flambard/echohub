import AppLayout from '@/layouts/app-layout';
import { ChatView } from '@/components/hub/chat-view';
import { ContactList } from '@/components/hub/contact-list';
import { Button } from '@/components/ui/button';
import { useContactsStore } from '@/stores/contacts';
import { useMessagesStore } from '@/stores/messages';
import { type BreadcrumbItem, type Contact } from '@/types';
import { Head } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
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
    const [isMobileContactsOpen, setIsMobileContactsOpen] = useState(false);

    // Zustand stores
    const { contacts, loading: contactsLoading, error: contactsError, fetchContacts } = useContactsStore();
    const { messages, loading, sending, error: messagesError, fetchHistory, sendMessage, clearHistory } = useMessagesStore();

    // Fetch contacts on mount
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // Restore selected contact from localStorage after contacts are loaded
    useEffect(() => {
        if (contacts.length > 0 && !selectedContact) {
            const savedContactId = localStorage.getItem('hub_selected_contact_id');
            if (savedContactId) {
                const contact = contacts.find(c => c.id === parseInt(savedContactId));
                if (contact) {
                    setSelectedContact(contact);
                    // If restoring a contact on mobile, close the contacts panel
                    if (window.innerWidth < 768) {
                        setIsMobileContactsOpen(false);
                    }
                }
            }
        }
    }, [contacts, selectedContact]);

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
        setIsMobileContactsOpen(false); // Close mobile contacts on selection
        // Persist selected contact to localStorage
        localStorage.setItem('hub_selected_contact_id', contact.id.toString());
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

            <div className="relative flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                {/* Mobile Menu Button - Only show when contact selected on mobile */}
                {selectedContact && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-4 z-20 md:hidden"
                        onClick={() => setIsMobileContactsOpen(!isMobileContactsOpen)}
                    >
                        {isMobileContactsOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                )}

                {/* Contact List Sidebar */}
                <div
                    className={`
                        w-full md:w-80 h-full
                        border-r border-sidebar-border bg-card
                        transition-transform duration-200 ease-in-out
                        ${
                            // Desktop: always visible (static)
                            'md:relative md:translate-x-0'
                        }
                        ${
                            // Mobile: conditional visibility
                            selectedContact
                                ? `absolute z-10 ${isMobileContactsOpen ? 'translate-x-0' : '-translate-x-full'}`
                                : 'relative translate-x-0'
                        }
                    `}
                >
                    <ContactList
                        contacts={contacts}
                        selectedContact={selectedContact}
                        onSelectContact={handleSelectContact}
                        loading={contactsLoading}
                        error={contactsError}
                    />
                </div>

                {/* Chat View - Hidden on mobile when no contact selected */}
                <div className={`flex-1 bg-background ${!selectedContact ? 'hidden md:block' : ''}`}>
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
