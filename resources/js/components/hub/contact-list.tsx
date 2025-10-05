import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Contact } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
                <AnimatePresence mode="wait">
                    {filteredContacts.length === 0 ? (
                        <motion.div
                            key="no-contacts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex h-full items-center justify-center p-3 text-center text-xs text-muted-foreground"
                        >
                            No contacts found
                        </motion.div>
                    ) : (
                        <motion.div
                            key="contacts-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {appContacts.length > 0 && (
                                <motion.div
                                    className="px-2 pt-2 pb-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Apps
                                    </div>
                                    {appContacts.map((contact, index) => (
                                        <motion.div
                                            key={contact.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ContactItem
                                                contact={contact}
                                                isSelected={selectedContact?.id === contact.id}
                                                onClick={() => onSelectContact(contact)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {humanContacts.length > 0 && (
                                <motion.div
                                    className="px-2 pt-2 pb-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: appContacts.length > 0 ? 0.2 : 0.1 }}
                                >
                                    <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Humans
                                    </div>
                                    {humanContacts.map((contact, index) => (
                                        <motion.div
                                            key={contact.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ContactItem
                                                contact={contact}
                                                isSelected={selectedContact?.id === contact.id}
                                                onClick={() => onSelectContact(contact)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
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
        <motion.button
            onClick={onClick}
            className={`flex w-full items-center gap-2 rounded-md p-2 text-left ${
                isSelected ? 'bg-accent' : ''
            }`}
            whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--accent))' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    {contact.type === 'app' ? (
                        <Bot className="size-4 text-primary" />
                    ) : (
                        <User className="size-4 text-primary" />
                    )}
                </div>
                {contact.type === 'app' && (
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Circle
                            className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background ${statusColor}`}
                            fill="currentColor"
                        />
                    </motion.div>
                )}
            </motion.div>
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
        </motion.button>
    );
}
