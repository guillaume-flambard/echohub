import axios from '@/bootstrap';
import { getAxiosErrorMessage } from '@/lib/error-utils';
import type { App } from '@/types';
import { create } from 'zustand';

interface AppsState {
    apps: App[];
    loading: boolean;
    error: string | null;
    fetchApps: () => Promise<void>;
    createApp: (data: Partial<App>) => Promise<App>;
    updateApp: (id: number, data: Partial<App>) => Promise<App>;
    deleteApp: (id: number) => Promise<void>;
    testConnection: (id: number) => Promise<boolean>;
    syncMetadata: (id: number) => Promise<void>;
    getAppStats: (
        id: number,
        type?: string,
    ) => Promise<Record<string, unknown>>;
    getAppActivity: (
        id: number,
        limit?: number,
    ) => Promise<Record<string, unknown>>;
}

export const useAppsStore = create<AppsState>((set) => ({
    apps: [],
    loading: false,
    error: null,

    fetchApps: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/apps');
            set({ apps: response.data.apps || response.data, loading: false });
        } catch (err: unknown) {
            set({
                error: getAxiosErrorMessage(err),
                loading: false,
            });
        }
    },

    createApp: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/hub/apps', data);
            const newApp = response.data.app || response.data;

            set((state) => ({
                apps: [...state.apps, newApp],
                loading: false,
            }));

            return newApp;
        } catch (err: unknown) {
            set({
                error: getAxiosErrorMessage(err),
                loading: false,
            });
            throw err;
        }
    },

    updateApp: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`/hub/apps/${id}`, data);
            const updatedApp = response.data.app || response.data;

            set((state) => ({
                apps: state.apps.map((app) =>
                    app.id === id ? updatedApp : app,
                ),
                loading: false,
            }));

            return updatedApp;
        } catch (err: unknown) {
            set({
                error: getAxiosErrorMessage(err),
                loading: false,
            });
            throw err;
        }
    },

    deleteApp: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/hub/apps/${id}`);

            set((state) => ({
                apps: state.apps.filter((app) => app.id !== id),
                loading: false,
            }));
        } catch (err: unknown) {
            set({
                error: getAxiosErrorMessage(err),
                loading: false,
            });
            throw err;
        }
    },

    testConnection: async (id) => {
        try {
            const response = await axios.post(
                `/hub/apps/${id}/test-connection`,
            );
            const { success, status } = response.data;

            // Update app status in store
            set((state) => ({
                apps: state.apps.map((app) =>
                    app.id === id ? { ...app, status } : app,
                ),
            }));

            return success;
        } catch (err: unknown) {
            set({ error: getAxiosErrorMessage(err) });
            return false;
        }
    },

    syncMetadata: async (id) => {
        try {
            const response = await axios.post(`/hub/apps/${id}/sync-metadata`);
            const updatedApp = response.data.app;

            set((state) => ({
                apps: state.apps.map((app) =>
                    app.id === id ? updatedApp : app,
                ),
            }));
        } catch (err: unknown) {
            set({ error: getAxiosErrorMessage(err) });
            throw err;
        }
    },

    getAppStats: async (id, type = 'summary') => {
        try {
            const response = await axios.get(`/hub/apps/${id}/stats`, {
                params: { type },
            });
            return response.data.stats;
        } catch (err: unknown) {
            set({ error: getAxiosErrorMessage(err) });
            throw err;
        }
    },

    getAppActivity: async (id, limit = 10) => {
        try {
            const response = await axios.get(`/hub/apps/${id}/activity`, {
                params: { limit },
            });
            return response.data.activity;
        } catch (err: unknown) {
            set({ error: getAxiosErrorMessage(err) });
            throw err;
        }
    },
}));
