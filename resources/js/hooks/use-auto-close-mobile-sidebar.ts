import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';

/**
 * Automatically close the app sidebar on mobile devices
 * This hook should be used in layouts or pages to provide better mobile UX
 * Safe to use even without SidebarProvider - will do nothing if provider is missing
 */
export function useAutoCloseMobileSidebar() {
    // Safely get sidebar context (might not be available in all layouts)
    let sidebar;
    try {
        sidebar = useSidebar();
    } catch {
        // No SidebarProvider available, that's ok
        sidebar = null;
    }

    useEffect(() => {
        if (sidebar?.isMobile) {
            sidebar.setOpenMobile(false);
        }
    }, [sidebar]);
}
