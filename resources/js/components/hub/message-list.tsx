import type { Contact, Message } from '@/types';
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
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        No messages yet. Start a conversation with {contact.name}!
                    </p>
                    {contact.type === 'app' && contact.app && (
                        <div className="mt-4 rounded-lg bg-muted/50 p-4">
                            <p className="text-xs font-semibold text-muted-foreground">
                                Suggested questions:
                            </p>
                            <ul className="mt-2 space-y-1 text-left text-sm">
                                <li>• What's the current status?</li>
                                <li>• Show me recent activity</li>
                                <li>• Give me a summary</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => (
                <MessageBubble
                    key={index}
                    message={message}
                    contact={contact}
                    isLastMessage={index === messages.length - 1}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

interface MessageBubbleProps {
    message: Message;
    contact: Contact;
    isLastMessage: boolean;
}

function MessageBubble({ message, contact, isLastMessage }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
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
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                }`}
            >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <p className={`mt-1 text-xs ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>

            {isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-4 text-primary" />
                </div>
            )}
        </div>
    );
}
