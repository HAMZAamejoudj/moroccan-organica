'use client';

import { useEffect } from 'react';
import { incrementPostViewCount } from '@/lib/blog/actions';

interface BlogPostViewTrackerProps {
    postId: string;
    title?: string;
}

const BOT_UA_PATTERN = /bot|crawl|spider|slurp|lighthouse|headless|facebookexternalhit|whatsapp|bingpreview/i;

export function BlogPostViewTracker({ postId, title }: BlogPostViewTrackerProps) {
    useEffect(() => {
        if (!postId || typeof window === 'undefined') return;
        if (navigator.webdriver || BOT_UA_PATTERN.test(navigator.userAgent)) return;

        const storageKey = `viewed_post_${postId}`;
        try {
            if (window.sessionStorage.getItem(storageKey)) return;
        } catch {
            // Ignore storage access errors in private browsing modes
        }

        const timer = window.setTimeout(() => {
            try {
                window.sessionStorage.setItem(storageKey, '1');
            } catch {
                // Ignore
            }
            incrementPostViewCount(postId).catch((err) => {
                console.error('Error incrementing post view count:', err);
            });
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [postId]);

    useEffect(() => {
        if (title && typeof document !== 'undefined') {
            document.title = title;
        }
    }, [title]);

    return null;
}
