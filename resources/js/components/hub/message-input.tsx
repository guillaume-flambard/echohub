import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Contact } from '@/types';
import { Loader2, Send } from 'lucide-react';
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
            handleSend(e as any);
        }
    };

    const placeholder =
        contact.type === 'app'
            ? `Ask ${contact.name} anything...`
            : `Message ${contact.name}...`;

    return (
        <form onSubmit={handleSend} className="border-t border-sidebar-border p-4">
            <div className="flex gap-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isSending}
                    className="min-h-[60px] max-h-[200px] resize-none"
                    rows={2}
                />
                <Button
                    type="submit"
                    disabled={!message.trim() || disabled || isSending}
                    size="icon"
                    className="size-[60px] shrink-0"
                >
                    {isSending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
            </p>
        </form>
    );
}
