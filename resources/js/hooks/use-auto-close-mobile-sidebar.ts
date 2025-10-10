import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';

/**
 * Automatically close the app sidebar on mobile devices
 * This hook should be used in layouts or pages to provide better mobile UX
 * Safe to use even without SidebarProvider - will do nothing if provider is missing
 */
export function useAutoCloseMobileSidebar() {
    // Always call the hook, but handle the case where provider is missing
    const sidebar = useSidebar();

    useEffect(() => {
        if (sidebar?.isMobile) {
            sidebar.setOpenMobile(false);
        }
    }, [sidebar]);
}
