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
            <div className="flex h-full flex-col gap-3 p-3">
                <Skeleton className="h-8 w-full" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-7 w-16" />
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
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
            <div className="border-b border-sidebar-border p-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-sm"
                    />
                </div>
                <div className="mt-2 flex gap-1.5">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="h-7 text-xs"
                    >
                        All
                    </Button>
                    <Button
                        variant={filterType === 'app' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('app')}
                        className="h-7 text-xs"
                    >
                        Apps
                    </Button>
                    <Button
                        variant={filterType === 'human' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('human')}
                        className="h-7 text-xs"
                    >
                        Humans
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {appContacts.length > 0 && (
                    <div className="px-2 pt-2 pb-1">
                        <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                    <div className="px-2 pt-2 pb-1">
                        <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                    <div className="flex h-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
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
            className={`flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-accent ${
                isSelected ? 'bg-accent' : ''
            }`}
        >
            <div className="relative">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    {contact.type === 'app' ? (
                        <Bot className="size-4 text-primary" />
                    ) : (
                        <User className="size-4 text-primary" />
                    )}
                </div>
                {contact.type === 'app' && (
                    <Circle
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background ${statusColor}`}
                        fill="currentColor"
                    />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium">{contact.name}</p>
                    {contact.type === 'app' && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                            Minerva
                        </Badge>
                    )}
                </div>
                {contact.app && (
                    <p className="truncate text-[11px] text-muted-foreground">
                        {contact.app.domain}
                    </p>
                )}
            </div>
        </button>
    );
}
