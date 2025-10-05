import { Button } from '@/components/ui/button';
import type { Contact } from '@/types';
import { Loader2, Paperclip, Send } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface MessageInputProps {
    onSend: (content: string) => Promise<boolean>;
    disabled?: boolean;
    contact: Contact;
}

export function MessageInput({ onSend, disabled = false, contact }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();

        if (!message.trim() || isSending) return;

        setIsSending(true);
        const success = await onSend(message.trim());

        if (success) {
            setMessage('');
        }
        setIsSending(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSend(e as unknown as FormEvent);
        }
    };

    const placeholder =
        contact.type === 'app'
            ? `Ask ${contact.name} anything...`
            : `Message ${contact.name}...`;

    return (
        <form
            onSubmit={handleSend}
            className="border-t border-sidebar-border p-3"
        >
            <div className="relative rounded-3xl border border-input bg-background shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isSending}
                    className="w-full resize-none border-0 bg-transparent px-4 pt-3 pb-12 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    rows={1}
                />

                {/* Action Bar */}
                <div className="flex items-center justify-between border-t border-border/50 px-3 py-1.5">
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                            <Paperclip className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            Press Enter to send
                        </p>
                        <Button
                            type="submit"
                            disabled={!message.trim() || disabled || isSending}
                            size="icon"
                            className="h-7 w-7 rounded-full"
                        >
                            {isSending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Send className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
