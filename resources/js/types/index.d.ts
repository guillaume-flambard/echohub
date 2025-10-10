import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Matrix & Minerva types
export interface App {
    id: number;
    name: string;
    domain: string;
    matrix_user_id: string;
    status: 'online' | 'offline' | 'degraded';
    capabilities: string[];
    api_config?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    last_ping?: string;
    api_key?: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: number;
    user_id: number;
    matrix_id: string;
    type: 'app' | 'human';
    app_id?: number;
    name: string;
    avatar?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    app?: App;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ConversationHistory {
    messages: Message[];
}

export interface MatrixConfig {
    homeserverUrl: string;
    accessToken?: string;
    userId?: string;
}

export interface MinervaResponse {
    success: boolean;
    message: Message;
    response: Message;
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
    error?: string;
}
