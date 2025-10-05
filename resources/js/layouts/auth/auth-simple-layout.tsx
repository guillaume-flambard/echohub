import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { MessageSquare, Radio, Zap } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Left side - Branding */}
            <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#f53003] to-[#d42900] p-12 text-white">
                <Link href={home()} className="flex items-center gap-3">
                    <img src="/logo.svg" alt="EchoHub" className="h-8 brightness-0 invert" />
                </Link>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Unified App Messaging
                        </h1>
                        <p className="text-lg text-white/90">
                            Connect all your applications in one central hub. Chat with apps and humans seamlessly.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">AI-Powered Apps</h3>
                                <p className="text-sm text-white/80">
                                    Chat with intelligent app assistants powered by Minerva AI
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                                <Radio className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Real-time Messaging</h3>
                                <p className="text-sm text-white/80">
                                    Matrix protocol ensures instant, secure communication
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Central Hub</h3>
                                <p className="text-sm text-white/80">
                                    Manage all your apps from one unified interface
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-white/60">
                    © 2025 EchoHub. Unified app messaging platform.
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Right side - Form */}
            <div className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-8 lg:hidden text-center">
                        <Link href={home()} className="inline-block">
                            <img src="/logo.svg" alt="EchoHub" className="h-8 mx-auto" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
