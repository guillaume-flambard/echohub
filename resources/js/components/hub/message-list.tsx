import type { Contact, Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MessageListProps {
    messages: Message[];
    contact: Contact;
}

export function MessageList({ messages, contact }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        No messages yet. Start a conversation with {contact.name}!
                    </p>
                    {contact.type === 'app' && contact.app && (
                        <div className="mt-4 rounded-2xl bg-muted/50 p-4">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Suggested questions:
                            </p>
                            <ul className="mt-2 space-y-2 text-left text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    <span>What's the current status?</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Show me recent activity</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Give me a summary</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.timestamp || index}
                        message={message}
                        contact={contact}
                    />
                ))}
            </AnimatePresence>
            <div ref={bottomRef} />
        </div>
    );
}

interface MessageBubbleProps {
    message: Message;
    contact: Contact;
}

function MessageBubble({ message, contact }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {contact.type === 'app' ? (
                        <Bot className="size-4 text-primary" />
                    ) : (
                        <User className="size-4 text-primary" />
                    )}
                </div>
            )}

            <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                }`}
            >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                {message.timestamp && (
                    <p className={`mt-1.5 text-xs ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </div>

            {isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-4 text-primary" />
                </div>
            )}
        </motion.div>
    );
}
