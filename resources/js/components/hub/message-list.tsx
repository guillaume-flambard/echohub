import type { Contact, Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Check, Copy, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import 'highlight.js/styles/github-dark.css';

interface MessageListProps {
    messages: Message[];
    contact: Contact;
    sending?: boolean;
}

export function MessageList({ messages, contact, sending = false }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

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
                {sending && <TypingIndicator key="typing" contact={contact} />}
            </AnimatePresence>
            <div ref={bottomRef} />
        </div>
    );
}

interface TypingIndicatorProps {
    contact: Contact;
}

function TypingIndicator({ contact }: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3"
        >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {contact.type === 'app' ? (
                    <Bot className="size-4 text-primary" />
                ) : (
                    <User className="size-4 text-primary" />
                )}
            </div>

            <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                <motion.div
                    className="h-2 w-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="h-2 w-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="h-2 w-2 rounded-full bg-muted-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
        </motion.div>
    );
}

interface MessageBubbleProps {
    message: Message;
    contact: Contact;
}

function MessageBubble({ message, contact }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const relativeTime = message.timestamp
        ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
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

            <div className="flex max-w-[70%] flex-col gap-1">
                <div
                    className={`relative rounded-2xl px-4 py-3 ${
                        isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                    }`}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                                    code: ({ className, children }) => {
                                        const isInline = !className;
                                        return isInline ? (
                                            <code className="rounded bg-muted-foreground/10 px-1.5 py-0.5 text-xs font-mono">
                                                {children}
                                            </code>
                                        ) : (
                                            <code className={className}>{children}</code>
                                        );
                                    },
                                    pre: ({ children }) => (
                                        <pre className="overflow-x-auto rounded-lg bg-muted-foreground/10 p-3 text-xs">
                                            {children}
                                        </pre>
                                    ),
                                    ul: ({ children }) => <ul className="my-2 list-disc pl-4 text-sm">{children}</ul>,
                                    ol: ({ children }) => <ol className="my-2 list-decimal pl-4 text-sm">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    h1: ({ children }) => <h1 className="mb-2 text-lg font-bold">{children}</h1>,
                                    h2: ({ children }) => <h2 className="mb-2 text-base font-bold">{children}</h2>,
                                    h3: ({ children }) => <h3 className="mb-1 text-sm font-bold">{children}</h3>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Copy button for AI messages */}
                    {!isUser && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="absolute -right-8 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            {copied ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    )}
                </div>

                {/* Timestamp */}
                {relativeTime && (
                    <p className={`px-2 text-xs ${isUser ? 'text-right text-muted-foreground' : 'text-left text-muted-foreground'}`}>
                        {relativeTime}
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
