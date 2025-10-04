import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as sdk from 'matrix-js-sdk';
import type { MatrixConfig } from '@/types';

interface MatrixContextType {
    client: sdk.MatrixClient | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    connect: (config: MatrixConfig) => Promise<void>;
    disconnect: () => void;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

interface MatrixProviderProps {
    children: ReactNode;
}

export function MatrixProvider({ children }: MatrixProviderProps) {
    const [client, setClient] = useState<sdk.MatrixClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connect = async (config: MatrixConfig) => {
        if (!config.accessToken || !config.userId) {
            setError('Missing access token or user ID');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            const matrixClient = sdk.createClient({
                baseUrl: config.homeserverUrl,
                accessToken: config.accessToken,
                userId: config.userId,
            });

            // Set up event listeners
            matrixClient.on(sdk.ClientEvent.Sync, (state) => {
                if (state === 'PREPARED') {
                    setIsConnected(true);
                    setIsConnecting(false);
                }
            });

            matrixClient.on(sdk.ClientEvent.SyncError, (err) => {
                console.error('Matrix sync error:', err);
                setError(err.message);
            });

            // Start the client
            await matrixClient.startClient({ initialSyncLimit: 10 });

            setClient(matrixClient);
        } catch (err: any) {
            console.error('Failed to connect to Matrix:', err);
            setError(err.message || 'Failed to connect');
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        if (client) {
            client.stopClient();
            setClient(null);
            setIsConnected(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (client) {
                client.stopClient();
            }
        };
    }, [client]);

    return (
        <MatrixContext.Provider
            value={{
                client,
                isConnected,
                isConnecting,
                error,
                connect,
                disconnect,
            }}
        >
            {children}
        </MatrixContext.Provider>
    );
}

export function useMatrix() {
    const context = useContext(MatrixContext);
    if (context === undefined) {
        throw new Error('useMatrix must be used within a MatrixProvider');
    }
    return context;
}
