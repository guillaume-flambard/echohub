import { BookingTrendsChart } from '@/components/booking-trends-chart';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard, hub } from '@/routes';
import { useContactsStore } from '@/stores/contacts';
import { useDashboardStore } from '@/stores/dashboard';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Bot, MessageSquare, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const {
        stats,
        recentActivity,
        trends,
        loading: dashboardLoading,
        fetchAll,
    } = useDashboardStore();
    const {
        contacts,
        loading: contactsLoading,
        fetchContacts,
    } = useContactsStore();

    useEffect(() => {
        fetchAll();
        fetchContacts('app');
    }, [fetchAll, fetchContacts]);

    const loading = dashboardLoading || contactsLoading;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<Bot className="h-5 w-5" />}
                        title="Total Apps"
                        value={stats?.total_apps ?? 0}
                        loading={loading}
                    />
                    <StatCard
                        icon={<Activity className="h-5 w-5" />}
                        title="Apps Online"
                        value={stats?.apps_online ?? 0}
                        subtitle={`${stats?.total_apps ?? 0} total`}
                        loading={loading}
                    />
                    <StatCard
                        icon={<MessageSquare className="h-5 w-5" />}
                        title="Messages Today"
                        value={stats?.messages_today ?? 0}
                        loading={loading}
                    />
                    <StatCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        title="Active Chats"
                        value={stats?.active_conversations ?? 0}
                        loading={loading}
                    />
                </div>

                {/* 7-Day Booking Trends Chart */}
                <div className="rounded-xl border border-sidebar-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        7-Day Booking Trends
                    </h2>
                    <BookingTrendsChart data={trends} loading={loading} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Your Apps */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Your Apps
                        </h2>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : contacts.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    No apps configured yet.
                                </div>
                            ) : (
                                contacts.map((contact) => (
                                    <Link
                                        key={contact.id}
                                        href={hub()}
                                        className="flex items-center justify-between rounded-lg border border-sidebar-border/50 p-3 hover:bg-accent/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f5300308] dark:bg-[#FF443308]">
                                                <Bot className="h-5 w-5 text-[#f53003] dark:text-[#FF4433]" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {contact.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {contact.app?.domain}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                contact.app?.status === 'online'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {contact.app?.status}
                                        </Badge>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border border-sidebar-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    No recent activity. Start chatting with your
                                    apps in the{' '}
                                    <Link
                                        href={hub()}
                                        className="font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                    >
                                        Hub
                                    </Link>
                                    .
                                </div>
                            ) : (
                                recentActivity
                                    .slice(0, 5)
                                    .map((activity, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 text-sm"
                                        >
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f5300308] dark:bg-[#FF443308]">
                                                <MessageSquare className="h-4 w-4 text-[#f53003] dark:text-[#FF4433]" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">
                                                        {activity.contact.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(
                                                            activity.message
                                                                .timestamp,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="line-clamp-2 text-muted-foreground">
                                                    {activity.message.role ===
                                                    'user'
                                                        ? '→ '
                                                        : '← '}
                                                    {activity.message.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    icon,
    title,
    value,
    subtitle,
    loading,
}: {
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle?: string;
    loading?: boolean;
}) {
    return (
        <div className="rounded-xl border border-sidebar-border bg-card p-6">
            <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f5300308] text-[#f53003] dark:bg-[#FF443308] dark:text-[#FF4433]">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    {loading ? (
                        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                    ) : (
                        <>
                            <p className="text-2xl font-semibold">{value}</p>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground">
                                    {subtitle}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
