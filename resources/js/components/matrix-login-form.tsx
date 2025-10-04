import { useState } from 'react';
import { useMatrixStore } from '@/stores/matrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MatrixLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { login, logout, isConnected, currentUserId } = useMatrixStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await login(username, password);
            if (result) {
                setSuccess(true);
                setUsername('');
                setPassword('');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setSuccess(false);
        } catch (err: any) {
            setError(err.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    };

    if (isConnected) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                                Connected to Matrix
                            </h3>
                            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                <p>Logged in as: <span className="font-mono">{currentUserId}</span></p>
                                <p className="mt-1">You can now chat with human contacts in the Hub.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    disabled={loading}
                >
                    {loading ? 'Disconnecting...' : 'Disconnect from Matrix'}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        Successfully connected to Matrix!
                    </p>
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="matrix-username">Matrix Username</Label>
                <Input
                    id="matrix-username"
                    type="text"
                    placeholder="@yourname:echohub.local"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                    Your Matrix user ID (e.g., @yourname:echohub.local)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="matrix-password">Password</Label>
                <Input
                    id="matrix-password"
                    type="password"
                    placeholder="Enter your Matrix password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Use the Matrix user you created with the Synapse server.
                    If you haven't created one yet, run:{' '}
                    <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900">
                        docker exec echohub_synapse register_new_matrix_user -u username -p password -a -c /data/homeserver.yaml http://localhost:8008
                    </code>
                </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Connecting...' : 'Connect to Matrix'}
            </Button>
        </form>
    );
}
