/**
 * Utility functions for error handling
 */

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}

export function isAxiosError(
    error: unknown,
): error is { response?: { data?: { message?: string } } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export function getAxiosErrorMessage(error: unknown): string {
    if (isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message;
    }
    return getErrorMessage(error);
}
