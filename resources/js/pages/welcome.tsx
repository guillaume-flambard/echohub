import { dashboard, hub, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bot, MessageSquare, Sparkles, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={hub()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Hub
                                </Link>
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="mb-4 flex items-center gap-2">
                                <Bot className="h-6 w-6 text-[#f53003] dark:text-[#FF4433]" />
                                <h1 className="text-lg font-medium">EchoHub</h1>
                            </div>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Manage all your applications through intelligent AI conversations
                                with Minerva. Chat with your apps like you chat with colleagues.
                            </p>

                            <div className="mb-6 space-y-4">
                                <FeatureItem
                                    icon={<MessageSquare className="h-4 w-4" />}
                                    title="Unified Hub"
                                    description="All your apps in one place. Chat with EchoTravels, Phangan.AI, and more through a single interface."
                                />
                                <FeatureItem
                                    icon={<Sparkles className="h-4 w-4" />}
                                    title="Context-Aware AI"
                                    description="Each Minerva instance knows about its specific app - from bookings to analytics to revenue trends."
                                />
                                <FeatureItem
                                    icon={<Zap className="h-4 w-4" />}
                                    title="Powered by Ollama"
                                    description="Fast, free, and private. Uses local AI models with no API costs. Switch to Claude or GPT anytime."
                                />
                            </div>

                            <div className="border-t border-[#e3e3e0] pt-6 dark:border-[#3E3E3A]">
                                <h2 className="mb-3 font-medium">Getting Started</h2>
                                <ul className="space-y-3 text-[#706f6c] dark:text-[#A1A09A]">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5300308] dark:bg-[#FF443308]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#f53003] dark:bg-[#FF4433]" />
                                        </span>
                                        <span>
                                            Install{' '}
                                            <a
                                                href="https://ollama.com"
                                                target="_blank"
                                                className="font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                            >
                                                Ollama
                                            </a>{' '}
                                            and pull a model: <code className="rounded bg-[#f5f5f4] px-1 py-0.5 text-[12px] dark:bg-[#1b1b1a]">ollama pull llama3.2:3b</code>
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5300308] dark:bg-[#FF443308]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#f53003] dark:bg-[#FF4433]" />
                                        </span>
                                        <span>
                                            Run migrations and seed sample apps:{' '}
                                            <code className="rounded bg-[#f5f5f4] px-1 py-0.5 text-[12px] dark:bg-[#1b1b1a]">php artisan migrate && php artisan db:seed</code>
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5300308] dark:bg-[#FF443308]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#f53003] dark:bg-[#FF4433]" />
                                        </span>
                                        <span>
                                            Visit the{' '}
                                            {auth.user ? (
                                                <Link
                                                    href={hub()}
                                                    className="font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                                >
                                                    Hub
                                                </Link>
                                            ) : (
                                                <span className="font-medium">Hub</span>
                                            )}{' '}
                                            and start chatting with your apps
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 border-t border-[#e3e3e0] pt-6 dark:border-[#3E3E3A]">
                                <h2 className="mb-3 font-medium">Resources</h2>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://github.com/yourusername/echohub"
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#e3e3e0] px-3 py-1.5 text-xs hover:border-[#19140035] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 15 15" fill="none">
                                            <path
                                                d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        GitHub
                                    </a>
                                    <a
                                        href="https://ollama.com"
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#e3e3e0] px-3 py-1.5 text-xs hover:border-[#19140035] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        Ollama
                                    </a>
                                    <a
                                        href="https://matrix.org"
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#e3e3e0] px-3 py-1.5 text-xs hover:border-[#19140035] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        Matrix
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col justify-between rounded-tr-lg rounded-tl-lg bg-[#f53003] p-6 pb-12 lg:w-[370px] lg:rounded-bl-none lg:rounded-tr-lg lg:p-10 dark:bg-[#FF4433]">
                            <div className="relative z-[1] flex flex-col">
                                <div className="mb-8 lg:mb-12">
                                    <h2 className="mb-2 text-lg font-semibold text-white">
                                        Chat with Your Apps
                                    </h2>
                                    <p className="text-sm leading-relaxed text-white/90">
                                        Minerva AI brings natural language interaction to your entire app ecosystem.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <ExampleMessage
                                        type="user"
                                        message="What's the status of EchoTravels?"
                                    />
                                    <ExampleMessage
                                        type="assistant"
                                        message="EchoTravels is online and healthy. You have 47 bookings this week, up 12% from last week."
                                    />
                                    <ExampleMessage
                                        type="user"
                                        message="Show me revenue trends"
                                    />
                                    <ExampleMessage
                                        type="assistant"
                                        message="Revenue is up 23% this month with peaks on weekends. Top performing destination: Koh Phangan."
                                    />
                                </div>
                            </div>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 -bottom-12 bg-gradient-to-b from-transparent to-[#f53003] lg:-bottom-10 dark:to-[#FF4433]" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f5300308] text-[#f53003] dark:bg-[#FF443308] dark:text-[#FF4433]">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{title}</h3>
                <p className="mt-0.5 text-[#706f6c] dark:text-[#A1A09A]">{description}</p>
            </div>
        </div>
    );
}

function ExampleMessage({ type, message }: { type: 'user' | 'assistant'; message: string }) {
    return (
        <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    type === 'user'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/95 text-[#1b1b18]'
                }`}
            >
                {message}
            </div>
        </div>
    );
}
