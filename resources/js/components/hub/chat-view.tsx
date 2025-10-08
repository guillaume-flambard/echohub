import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Contact, Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MoreVertical, Trash2, User } from 'lucide-react';
import { MessageInput } from './message-input';
import { MessageList } from './message-list';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatViewProps {
    contact: Contact | null;
    messages: Message[];
    loading: boolean;
    sending: boolean;
    error: string | null;
    onSendMessage: (content: string) => Promise<boolean>;
    onClearHistory: () => Promise<boolean>;
    showMobileMenuButton?: boolean;
}

export function ChatView({
    contact,
    messages,
    loading,
    sending,
    error,
    onSendMessage,
    onClearHistory,
    showMobileMenuButton = false,
}: ChatViewProps) {
    if (!contact) {
        return (
            <div className="flex h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <div className="mb-4 flex justify-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="size-8 text-primary" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold">
                        Welcome to EchoHub
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a contact to start chatting with Minerva AI
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between border-b border-sidebar-border p-4 ${showMobileMenuButton ? 'pl-16 md:pl-4' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        {contact.type === 'app' ? (
                            <Bot className="size-5 text-primary" />
                        ) : (
                            <User className="size-5 text-primary" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold">{contact.name}</h2>
                        {contact.app && (
                            <p className="text-sm text-muted-foreground">{contact.app.domain}</p>
                        )}
                    </div>
                </div>

                {contact.type === 'app' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={onClearHistory}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 size-4" />
                                Clear History
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </motion.div>

            {/* Messages */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 space-y-4 p-4"
                    >
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={i % 2 === 0 ? 'flex justify-end' : ''}
                            >
                                <Skeleton className="h-16 w-3/4" />
                            </div>
                        ))}
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-1 items-center justify-center p-4"
                    >
                        <div className="max-w-md rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-center">
                            <p className="font-medium text-destructive">Error loading messages</p>
                            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                        </div>
                    </motion.div>
                ) : (
                    <MessageList key="messages" messages={messages} contact={contact} />
                )}
            </AnimatePresence>

            {/* Input */}
            <MessageInput onSend={onSendMessage} disabled={sending} contact={contact} />
        </div>
    );
}
