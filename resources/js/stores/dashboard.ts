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

interface DashboardState {
    stats: DashboardStats | null;
    recentActivity: RecentMessage[];
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    fetchActivity: () => Promise<void>;
    fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    recentActivity: [],
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

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const [statsRes, activityRes] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/dashboard/activity'),
            ]);

            set({
                stats: statsRes.data,
                recentActivity: activityRes.data.recent_activity || [],
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
