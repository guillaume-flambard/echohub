import { create } from 'zustand';
import axios from '@/bootstrap';

interface DashboardStats {
    total_apps: number;
    apps_online: number;
    messages_today: number;
    active_conversations: number;
}

interface RecentMessage {
    contact: {
        id: number;
        name: string;
        type: string;
    };
    message: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    };
}

interface TrendData {
    date: string;
    day: string;
    short_date: string;
    messages: number;
}

interface DashboardState {
    stats: DashboardStats | null;
    recentActivity: RecentMessage[];
    trends: TrendData[];
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    fetchActivity: () => Promise<void>;
    fetchTrends: () => Promise<void>;
    fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    recentActivity: [],
    trends: [],
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/dashboard/stats');
            set({ stats: response.data, loading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch stats',
                loading: false,
            });
        }
    },

    fetchActivity: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/dashboard/activity');
            set({ recentActivity: response.data.recent_activity || [], loading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch activity',
                loading: false,
            });
        }
    },

    fetchTrends: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/dashboard/trends');
            set({ trends: response.data.trends || [], loading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch trends',
                loading: false,
            });
        }
    },

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const [statsRes, activityRes, trendsRes] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/dashboard/activity'),
                axios.get('/api/dashboard/trends'),
            ]);

            set({
                stats: statsRes.data,
                recentActivity: activityRes.data.recent_activity || [],
                trends: trendsRes.data.trends || [],
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch dashboard data',
                loading: false,
            });
        }
    },
}));
