import * as sdk from 'matrix-js-sdk';
import { create } from 'zustand';

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
            localStorage.setItem('matrix_access_token', loginResponse.access_token);
            localStorage.setItem('matrix_user_id', loginResponse.user_id);

            // Start client
            await client.startClient({ initialSyncLimit: 10 });

            // Listen for messages
            client.on(sdk.RoomEvent.Timeline as any, (event: any, room: any) => {
                if (event.getType() === 'm.room.message') {
                    const roomId = room.roomId;
                    const message: MatrixMessage = {
                        sender: event.getSender(),
                        content: event.getContent().body,
                        timestamp: event.getTs(),
                        eventId: event.getId(),
                    };

                    set((state) => ({
                        rooms: {
                            ...state.rooms,
                            [roomId]: {
                                ...state.rooms[roomId],
                                roomId,
                                name: room.name || 'Direct Message',
                                messages: [...(state.rooms[roomId]?.messages || []), message],
                            },
                        },
                    }));
                }
            });

            set({
                client,
                isConnected: true,
                currentUserId: loginResponse.user_id,
                error: null,
            });

            return true;
        } catch (error: any) {
            set({ error: error.message || 'Login failed' });
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
            let roomId = await findOrCreateDirectRoom(client, contactMatrixId);

            // Send message
            await client.sendTextMessage(roomId, message);
        } catch (error: any) {
            set({ error: error.message || 'Failed to send message' });
            throw error;
        }
    },

    getMessages: (contactMatrixId) => {
        const { client, rooms } = get();
        if (!client) return [];

        // Find room with this contact
        const room = Object.values(rooms).find((r) => {
            const matrixRoom = client.getRoom(r.roomId);
            if (!matrixRoom) return false;

            const members = matrixRoom.getJoinedMembers();
            return members.some((m) => m.userId === contactMatrixId);
        });

        return room?.messages || [];
    },

    initializeFromStorage: () => {
        const accessToken = localStorage.getItem('matrix_access_token');
        const userId = localStorage.getItem('matrix_user_id');

        if (accessToken && userId) {
            const client = sdk.createClient({
                baseUrl: MATRIX_HOMESERVER,
                accessToken,
                userId,
            });

            client.startClient({ initialSyncLimit: 10 }).then(() => {
                // Listen for messages
                client.on(sdk.RoomEvent.Timeline as any, (event: any, room: any) => {
                    if (event.getType() === 'm.room.message') {
                        const roomId = room.roomId;
                        const message: MatrixMessage = {
                            sender: event.getSender(),
                            content: event.getContent().body,
                            timestamp: event.getTs(),
                            eventId: event.getId(),
                        };

                        set((state) => ({
                            rooms: {
                                ...state.rooms,
                                [roomId]: {
                                    ...state.rooms[roomId],
                                    roomId,
                                    name: room.name || 'Direct Message',
                                    messages: [...(state.rooms[roomId]?.messages || []), message],
                                },
                            },
                        }));
                    }
                });

                set({
                    client,
                    isConnected: true,
                    currentUserId: userId,
                });
            }).catch((error) => {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('matrix_access_token');
                localStorage.removeItem('matrix_user_id');
            });
        }
    },
}));

// Helper function to find or create a direct message room
async function findOrCreateDirectRoom(
    client: sdk.MatrixClient,
    targetUserId: string
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
        preset: 'trusted_private_chat',
    });

    return room_id;
}
