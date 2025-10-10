import * as sdk from 'matrix-js-sdk';
import { create } from 'zustand';
import { getErrorMessage } from '@/lib/error-utils';

// Matrix SDK types - using the actual SDK types
type MatrixEvent = sdk.MatrixEvent;

interface MatrixMessage {
    sender: string;
    content: string;
    timestamp: number;
    eventId: string;
}

interface MatrixRoom {
    roomId: string;
    name: string;
    messages: MatrixMessage[];
}

interface MatrixState {
    client: sdk.MatrixClient | null;
    isConnected: boolean;
    currentUserId: string | null;
    rooms: Record<string, MatrixRoom>;
    error: string | null;

    // Actions
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    sendMessage: (contactMatrixId: string, message: string) => Promise<void>;
    getMessages: (contactMatrixId: string) => MatrixMessage[];
    initializeFromStorage: () => void;
}

const MATRIX_HOMESERVER = 'http://localhost:8008';

export const useMatrixStore = create<MatrixState>((set, get) => ({
    client: null,
    isConnected: false,
    currentUserId: null,
    rooms: {},
    error: null,

    login: async (username, password) => {
        try {
            const tempClient = sdk.createClient({
                baseUrl: MATRIX_HOMESERVER,
            });

            const loginResponse = await tempClient.login('m.login.password', {
                user: username,
                password: password,
            });

            const client = sdk.createClient({
                baseUrl: MATRIX_HOMESERVER,
                accessToken: loginResponse.access_token,
                userId: loginResponse.user_id,
            });

            // Store credentials
            localStorage.setItem(
                'matrix_access_token',
                loginResponse.access_token,
            );
            localStorage.setItem('matrix_user_id', loginResponse.user_id);

            // Wait for initial sync to complete
            await new Promise<void>((resolve) => {
                client.once(
                    sdk.ClientEvent.Sync,
                    (state: string) => {
                        if (state === 'PREPARED') {
                            resolve();
                        }
                    },
                );
                client.startClient({ initialSyncLimit: 50 });
            });

            // Listen for new messages
            client.on(sdk.RoomEvent.Timeline, (event: MatrixEvent) => {
                if (event.getType() === 'm.room.message') {
                    // Trigger re-render when new messages arrive
                    set((state) => ({ ...state }));
                }
            });

            set({
                client,
                isConnected: true,
                currentUserId: loginResponse.user_id,
                error: null,
            });

            return true;
        } catch (error: unknown) {
            set({ error: 'Login failed' });
            console.error('Matrix login error:', error);
            return false;
        }
    },

    logout: async () => {
        const { client } = get();
        if (client) {
            try {
                await client.logout();
                client.stopClient();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('matrix_access_token');
        localStorage.removeItem('matrix_user_id');

        set({
            client: null,
            isConnected: false,
            currentUserId: null,
            rooms: {},
            error: null,
        });
    },

    sendMessage: async (contactMatrixId, message) => {
        const { client } = get();
        if (!client) {
            throw new Error('Not connected to Matrix');
        }

        try {
            // Find or create room with this contact
            const roomId = await findOrCreateDirectRoom(
                client,
                contactMatrixId,
            );

            // Send message
            await client.sendTextMessage(roomId, message);
        } catch (error: unknown) {
            set({ error: getErrorMessage(error) || 'Failed to send message' });
            throw error;
        }
    },

    getMessages: (contactMatrixId) => {
        const { client, currentUserId } = get();
        if (!client) return [];

        // Find room with this contact
        const rooms = client.getRooms();
        const room = rooms.find((r) => {
            const members = r.getJoinedMembers();
            return (
                members.some((m) => m.userId === contactMatrixId) &&
                members.some((m) => m.userId === currentUserId)
            );
        });

        if (!room) return [];

        // Get timeline events (message history from Matrix)
        const timeline = room.getLiveTimeline();
        const events = timeline.getEvents();

        // Convert to our message format
        const messages: MatrixMessage[] = events
            .filter((event) => event.getType() === 'm.room.message')
            .map((event) => ({
                sender: event.getSender() || '',
                content: event.getContent().body || '',
                timestamp: event.getTs() || Date.now(),
                eventId: event.getId() || '',
            }));

        return messages;
    },

    initializeFromStorage: async () => {
        const accessToken = localStorage.getItem('matrix_access_token');
        const userId = localStorage.getItem('matrix_user_id');

        if (accessToken && userId) {
            try {
                const client = sdk.createClient({
                    baseUrl: MATRIX_HOMESERVER,
                    accessToken,
                    userId,
                });

                // Wait for initial sync
                await new Promise<void>((resolve) => {
                    client.once(
                        sdk.ClientEvent.Sync,
                        (state: string) => {
                            if (state === 'PREPARED') {
                                resolve();
                            }
                        },
                    );
                    client.startClient({ initialSyncLimit: 50 });
                });

                // Listen for new messages
                client.on(sdk.RoomEvent.Timeline, (event: MatrixEvent) => {
                    if (event.getType() === 'm.room.message') {
                        // Trigger re-render when new messages arrive
                        set((state) => ({ ...state }));
                    }
                });

                set({
                    client,
                    isConnected: true,
                    currentUserId: userId,
                });
            } catch (error) {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('matrix_access_token');
                localStorage.removeItem('matrix_user_id');
            }
        }
    },
}));

// Helper function to find or create a direct message room
async function findOrCreateDirectRoom(
    client: sdk.MatrixClient,
    targetUserId: string,
): Promise<string> {
    // Check existing rooms
    const rooms = client.getRooms();
    const existingRoom = rooms.find((room) => {
        const members = room.getJoinedMembers();
        return (
            members.length === 2 &&
            members.some((m) => m.userId === targetUserId) &&
            members.some((m) => m.userId === client.getUserId())
        );
    });

    if (existingRoom) {
        return existingRoom.roomId;
    }

    // Create new room
    const { room_id } = await client.createRoom({
        is_direct: true,
        invite: [targetUserId],
        preset: 'trusted_private_chat' as sdk.Preset,
    });

    return room_id;
}
