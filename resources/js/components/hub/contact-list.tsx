import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Contact } from '@/types';
import { Bot, Circle, Search, User } from 'lucide-react';
import { useState } from 'react';

interface ContactListProps {
    contacts: Contact[];
    selectedContact: Contact | null;
    onSelectContact: (contact: Contact) => void;
    loading?: boolean;
    error?: string | null;
}

export function ContactList({
    contacts,
    selectedContact,
    onSelectContact,
    loading = false,
    error = null,
}: ContactListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'app' | 'human'>('all');

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || contact.type === filterType;
        return matchesSearch && matchesType;
    });

    const appContacts = filteredContacts.filter((c) => c.type === 'app');
    const humanContacts = filteredContacts.filter((c) => c.type === 'human');

    if (loading) {
        return (
            <div className="flex h-full flex-col gap-4 p-4">
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <div className="max-w-sm rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                    <p className="font-medium text-destructive">Error loading contacts</p>
                    <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-sidebar-border p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="mt-3 flex gap-2">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filterType === 'app' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('app')}
                    >
                        Apps
                    </Button>
                    <Button
                        variant={filterType === 'human' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('human')}
                    >
                        Humans
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {appContacts.length > 0 && (
                    <div className="p-2">
                        <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                            Apps
                        </div>
                        {appContacts.map((contact) => (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                isSelected={selectedContact?.id === contact.id}
                                onClick={() => onSelectContact(contact)}
                            />
                        ))}
                    </div>
                )}

                {humanContacts.length > 0 && (
                    <div className="p-2">
                        <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                            Humans
                        </div>
                        {humanContacts.map((contact) => (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                isSelected={selectedContact?.id === contact.id}
                                onClick={() => onSelectContact(contact)}
                            />
                        ))}
                    </div>
                )}

                {filteredContacts.length === 0 && (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                        No contacts found
                    </div>
                )}
            </div>
        </div>
    );
}

interface ContactItemProps {
    contact: Contact;
    isSelected: boolean;
    onClick: () => void;
}

function ContactItem({ contact, isSelected, onClick }: ContactItemProps) {
    const statusColor =
        contact.app?.status === 'online'
            ? 'bg-green-500'
            : contact.app?.status === 'degraded'
              ? 'bg-yellow-500'
              : 'bg-gray-400';

    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                isSelected ? 'bg-accent' : ''
            }`}
        >
            <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    {contact.type === 'app' ? (
                        <Bot className="size-5 text-primary" />
                    ) : (
                        <User className="size-5 text-primary" />
                    )}
                </div>
                {contact.type === 'app' && (
                    <Circle
                        className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background ${statusColor}`}
                        fill="currentColor"
                    />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{contact.name}</p>
                    {contact.type === 'app' && (
                        <Badge variant="secondary" className="text-xs">
                            Minerva
                        </Badge>
                    )}
                </div>
                {contact.app && (
                    <p className="truncate text-xs text-muted-foreground">
                        {contact.app.domain}
                    </p>
                )}
            </div>
        </button>
    );
}
