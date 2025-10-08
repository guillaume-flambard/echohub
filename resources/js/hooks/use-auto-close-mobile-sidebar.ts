import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';

/**
 * Automatically close the app sidebar on mobile devices
 * This hook should be used in layouts or pages to provide better mobile UX
 */
export function useAutoCloseMobileSidebar() {
    const { isMobile, setOpenMobile } = useSidebar();

    useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [isMobile, setOpenMobile]);
}
