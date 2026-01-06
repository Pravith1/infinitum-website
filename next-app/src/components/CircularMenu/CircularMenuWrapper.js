'use client';
import { usePathname } from 'next/navigation';
import CircularMenu from './CircularMenu';

export default function CircularMenuWrapper() {
    const pathname = usePathname();

    // Only show CircularMenu on the home page
    if (pathname !== '/') {
        return null;
    }

    return <CircularMenu />;
}
