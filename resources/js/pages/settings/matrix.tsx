import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import MatrixLoginForm from '@/components/matrix-login-form';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Matrix settings',
        href: '/settings/matrix',
    },
];

export default function Matrix() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Matrix settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Matrix Messaging"
                        description="Connect to Matrix to chat with human contacts directly in the Hub"
                    />
                    <MatrixLoginForm />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
