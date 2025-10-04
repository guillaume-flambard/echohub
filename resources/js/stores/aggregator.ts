import axios from '@/bootstrap';
import { create } from 'zustand';

interface AggregatedStats {
    total_apps: number;
    online_apps: number;
    offline_apps: number;
    apps_with_errors: number;
    total_data_points: number;
    by_app: Record<
        number,
        {
            app_name: string;
            status: string;
            stats?: any;
            error?: string;
        }
    >;
}

interface ActivityLog {
    id: number;
    app_name: string;
    endpoint: string;
    method: string;
    status: number;
    success: boolean;
    timestamp: string;
}

interface Analytics {
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    success_rate: number;
    by_app: Array<{
        app_id: number;
        app_name: string;
        total: number;
        successful: number;
        failed: number;
        success_rate: number;
    }>;
}

interface AggregatorState {
    stats: AggregatedStats | null;
    activity: ActivityLog[];
    analytics: Analytics | null;
    searchResults: Record<number, any>;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    fetchActivity: (limit?: number) => Promise<void>;
    fetchAnalytics: (appId?: number, from?: string, to?: string) => Promise<void>;
    search: (query: string, apps?: number[]) => Promise<void>;
    fetchLogs: (filters?: {
        app_id?: number;
        status?: 'success' | 'failed';
        from?: string;
        to?: string;
        limit?: number;
    }) => Promise<ActivityLog[]>;
}

export const useAggregatorStore = create<AggregatorState>((set, get) => ({
    stats: null,
    activity: [],
    analytics: null,
    searchResults: {},
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/aggregator/stats');
            set({
                stats: response.data.stats,
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
        }
    },

    fetchActivity: async (limit = 20) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/aggregator/activity', {
                params: { limit },
            });
            set({
                activity: response.data.activity,
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
        }
    },

    fetchAnalytics: async (appId, from, to) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/aggregator/analytics', {
                params: {
                    app_id: appId,
                    from,
                    to,
                },
            });
            set({
                analytics: response.data.analytics,
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
        }
    },

    search: async (query, apps) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/aggregator/search', {
                params: {
                    query,
                    apps,
                },
            });
            set({
                searchResults: response.data.results,
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
        }
    },

    fetchLogs: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/aggregator/logs', {
                params: filters,
            });
            const logs = response.data.logs;
            set({ loading: false });
            return logs;
        } catch (err: any) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
            throw err;
        }
    },
}));
