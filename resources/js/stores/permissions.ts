import axios from '@/bootstrap';
import { create } from 'zustand';

interface Permission {
    id: number;
    user_id: number;
    app_id: number;
    granted_scopes: string[];
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PermissionsState {
    permissions: Permission[];
    loading: boolean;
    error: string | null;
    fetchUserPermissions: () => Promise<void>;
    grantPermission: (
        userId: number,
        appId: number,
        scopes: string[],
        expiresAt?: string | null,
    ) => Promise<Permission>;
    revokePermission: (userId: number, appId: number) => Promise<void>;
    addScopes: (
        userId: number,
        appId: number,
        scopes: string[],
    ) => Promise<Permission>;
    removeScopes: (
        userId: number,
        appId: number,
        scopes: string[],
    ) => Promise<Permission>;
    extendPermission: (
        userId: number,
        appId: number,
        expiresAt: string,
    ) => Promise<Permission>;
    makePermanent: (userId: number, appId: number) => Promise<Permission>;
    bulkGrant: (
        userIds: number[],
        appId: number,
        scopes: string[],
        expiresAt?: string | null,
    ) => Promise<Permission[]>;
    bulkRevoke: (userIds: number[], appId: number) => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
    permissions: [],
    loading: false,
    error: null,

    fetchUserPermissions: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/hub/permissions');
            set({
                permissions: response.data.permissions || response.data,
                loading: false,
            });
        } catch {
            set({
                error: 'Operation failed',
                loading: false,
            });
        }
    },

    grantPermission: async (userId, appId, scopes, expiresAt = null) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/hub/permissions/grant', {
                user_id: userId,
                app_id: appId,
                scopes,
                expires_at: expiresAt,
            });

            const permission = response.data.permission;

            set((state) => ({
                permissions: [...state.permissions, permission],
                loading: false,
            }));

            return permission;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    revokePermission: async (userId, appId) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/hub/permissions/revoke', {
                user_id: userId,
                app_id: appId,
            });

            set((state) => ({
                permissions: state.permissions.filter(
                    (p) => !(p.user_id === userId && p.app_id === appId),
                ),
                loading: false,
            }));
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    addScopes: async (userId, appId, scopes) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/hub/permissions/add-scopes', {
                user_id: userId,
                app_id: appId,
                scopes,
            });

            const permission = response.data.permission;

            set((state) => ({
                permissions: state.permissions.map((p) =>
                    p.user_id === userId && p.app_id === appId ? permission : p,
                ),
                loading: false,
            }));

            return permission;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    removeScopes: async (userId, appId, scopes) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                '/hub/permissions/remove-scopes',
                {
                    user_id: userId,
                    app_id: appId,
                    scopes,
                },
            );

            const permission = response.data.permission;

            set((state) => ({
                permissions: state.permissions.map((p) =>
                    p.user_id === userId && p.app_id === appId ? permission : p,
                ),
                loading: false,
            }));

            return permission;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    extendPermission: async (userId, appId, expiresAt) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/hub/permissions/extend', {
                user_id: userId,
                app_id: appId,
                expires_at: expiresAt,
            });

            const permission = response.data.permission;

            set((state) => ({
                permissions: state.permissions.map((p) =>
                    p.user_id === userId && p.app_id === appId ? permission : p,
                ),
                loading: false,
            }));

            return permission;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    makePermanent: async (userId, appId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(
                '/hub/permissions/make-permanent',
                {
                    user_id: userId,
                    app_id: appId,
                },
            );

            const permission = response.data.permission;

            set((state) => ({
                permissions: state.permissions.map((p) =>
                    p.user_id === userId && p.app_id === appId ? permission : p,
                ),
                loading: false,
            }));

            return permission;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    bulkGrant: async (userIds, appId, scopes, expiresAt = null) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/hub/permissions/bulk-grant', {
                user_ids: userIds,
                app_id: appId,
                scopes,
                expires_at: expiresAt,
            });

            const permissions = response.data.permissions;

            set((state) => ({
                permissions: [...state.permissions, ...permissions],
                loading: false,
            }));

            return permissions;
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },

    bulkRevoke: async (userIds, appId) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/hub/permissions/bulk-revoke', {
                user_ids: userIds,
                app_id: appId,
            });

            set((state) => ({
                permissions: state.permissions.filter(
                    (p) => !(userIds.includes(p.user_id) && p.app_id === appId),
                ),
                loading: false,
            }));
        } catch (err: unknown) {
            set({
                error: 'Operation failed',
                loading: false,
            });
            throw err;
        }
    },
}));
