import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getErrorMessage } from '@/lib/error-utils';
import axios from 'axios';
import { Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface AISettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface AISetting {
    id: number;
    provider: 'ollama' | 'openai' | 'anthropic';
    model: string;
    base_url: string;
    has_api_key: boolean;
}

interface AIModel {
    id: string;
    name: string;
}

export function AISettingsModal({ open, onOpenChange }: AISettingsModalProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [setting, setSetting] = useState<AISetting | null>(null);
    const [provider, setProvider] = useState<'ollama' | 'openai' | 'anthropic'>(
        'ollama',
    );
    const [model, setModel] = useState('');
    const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
    const [apiKey, setApiKey] = useState('');
    const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);

    const loadSettings = async () => {
        try {
            const response = await axios.get('/api/ai-settings');
            const data = response.data.setting;
            setSetting(data);
            setProvider(data.provider);
            setModel(data.model);
            setBaseUrl(data.base_url);
            // Don't load API key for security
        } catch (error: unknown) {
            console.error(
                'Failed to load AI settings:',
                getErrorMessage(error),
            );
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableModels = useCallback(async () => {
        setLoadingModels(true);
        try {
            const response = await axios.get('/api/ai-settings/models', {
                params: {
                    provider,
                    base_url: provider === 'ollama' ? baseUrl : undefined,
                },
            });
            setAvailableModels(response.data.models);
        } catch (error: unknown) {
            console.error(
                'Failed to load available models:',
                getErrorMessage(error),
            );
        } finally {
            setLoadingModels(false);
        }
    }, [provider, baseUrl]);

    // Load current settings
    useEffect(() => {
        if (open) {
            loadSettings();
        }
    }, [open]);

    // Load available models when provider or base URL changes
    useEffect(() => {
        if (open && provider) {
            loadAvailableModels();
        }
    }, [open, provider, loadAvailableModels]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put('/api/ai-settings', {
                provider,
                model,
                base_url: baseUrl,
                api_key: apiKey || undefined,
            });
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onOpenChange(false);
            }, 1500);
        } catch (error: unknown) {
            console.error(
                'Failed to save AI settings:',
                getErrorMessage(error),
            );
        } finally {
            setSaving(false);
        }
    };

    const needsApiKey = provider !== 'ollama';
    const hasApiKey = setting?.has_api_key || false;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>AI Settings</DialogTitle>
                    <DialogDescription>
                        Configure the AI provider and model for Minerva.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {/* Provider */}
                        <div className="space-y-2">
                            <Label htmlFor="provider">Provider</Label>
                            <Select
                                value={provider}
                                onValueChange={(v: string) =>
                                    setProvider(
                                        v as 'ollama' | 'openai' | 'anthropic',
                                    )
                                }
                            >
                                <SelectTrigger id="provider">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ollama">
                                        Ollama (Local)
                                    </SelectItem>
                                    <SelectItem value="openai">
                                        OpenAI
                                    </SelectItem>
                                    <SelectItem value="anthropic">
                                        Anthropic (Claude)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {provider === 'ollama' &&
                                    'Free local AI models'}
                                {provider === 'openai' &&
                                    'Requires OpenAI API key'}
                                {provider === 'anthropic' &&
                                    'Requires Anthropic API key'}
                            </p>
                        </div>

                        {/* Base URL (Ollama only) */}
                        {provider === 'ollama' && (
                            <div className="space-y-2">
                                <Label htmlFor="base-url">Base URL</Label>
                                <Input
                                    id="base-url"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder="http://localhost:11434"
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL of your Ollama server
                                </p>
                            </div>
                        )}

                        {/* API Key (OpenAI/Anthropic only) */}
                        {needsApiKey && (
                            <div className="space-y-2">
                                <Label htmlFor="api-key">API Key</Label>
                                <Input
                                    id="api-key"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={
                                        hasApiKey
                                            ? '••••••••••••••••'
                                            : 'Enter API key'
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {hasApiKey
                                        ? 'Leave empty to keep existing key'
                                        : 'Required for external providers'}
                                </p>
                            </div>
                        )}

                        {/* Model */}
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Select
                                value={model}
                                onValueChange={setModel}
                                disabled={loadingModels}
                            >
                                <SelectTrigger id="model">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loadingModels ? (
                                        <div className="flex items-center justify-center py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : (
                                        availableModels.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {availableModels.length === 0 && !loadingModels
                                    ? 'No models available'
                                    : 'Select the AI model to use'}
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || saving || !model}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
