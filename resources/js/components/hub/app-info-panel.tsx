import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Contact } from '@/types';
import { motion } from 'framer-motion';
import { Activity, ExternalLink, Globe, Key } from 'lucide-react';

interface AppInfoPanelProps {
    contact: Contact;
}

export function AppInfoPanel({ contact }: AppInfoPanelProps) {
    if (contact.type !== 'app' || !contact.app) {
        return null;
    }

    const { app } = contact;

    const statusColors = {
        online: 'bg-green-500',
        degraded: 'bg-yellow-500',
        offline: 'bg-gray-400',
    };

    const statusLabels = {
        online: 'Online',
        degraded: 'Degraded',
        offline: 'Offline',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="hidden w-80 border-l border-sidebar-border bg-card xl:block"
        >
            <div className="flex h-full flex-col gap-4 p-4">
                {/* App Status Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${statusColors[app.status]}`} />
                            <span className="text-sm font-medium">{statusLabels[app.status]}</span>
                        </div>

                        {app.last_ping && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Activity className="h-3 w-3" />
                                <span>
                                    Last ping:{' '}
                                    {new Date(app.last_ping).toLocaleString([], {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* App Details Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                <span className="font-medium">Domain</span>
                            </div>
                            <a
                                href={`https://${app.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm hover:underline"
                            >
                                {app.domain}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Key className="h-3 w-3" />
                                <span className="font-medium">API Key</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 rounded bg-muted px-2 py-1 text-xs font-mono">
                                    {app.api_key.substring(0, 20)}...
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            asChild
                        >
                            <a
                                href={`https://${app.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Visit Website
                            </a>
                        </Button>

                        <Button variant="outline" size="sm" className="w-full justify-start">
                            <Activity className="mr-2 h-4 w-4" />
                            View Logs
                        </Button>
                    </CardContent>
                </Card>

                {/* App Metadata */}
                {app.metadata && Object.keys(app.metadata).length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(app.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{key}</span>
                                        <span className="font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </motion.div>
    );
}
