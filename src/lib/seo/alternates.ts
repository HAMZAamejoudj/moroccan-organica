import type { Metadata } from 'next';
import { getLocalizedHref } from '@/lib/utils';

export const BASE_URL = 'https://www.moroccanorganica.com';

function normalizePath(path: string): string {
    const trimmed = path.trim();
    if (!trimmed || trimmed === '/') return '/';
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function buildAbsoluteLocalizedUrl(path: string, lang: string): string {
    const cleanPath = normalizePath(path);
    const localized = getLocalizedHref(cleanPath, lang);
    return `${BASE_URL}${localized}`;
}

function normalizeCustomCanonical(customCanonical: string | null | undefined, fallback: string): string {
    if (!customCanonical || !customCanonical.trim()) return fallback;
    let url = customCanonical.trim();
    if (url.startsWith('/')) {
        url = `${BASE_URL}${url}`;
    }
    // Strip legacy /en prefix from DB-stored canonicals to match English root routing
    url = url.replace(`${BASE_URL}/en/`, `${BASE_URL}/`);
    if (url === `${BASE_URL}/en`) {
        url = `${BASE_URL}/`;
    }
    // Normalize homepage canonical with trailing slash to match final URL
    if (url === BASE_URL) {
        url = `${BASE_URL}/`;
    }
    return url;
}

/**
 * Builds canonical + full bidirectional hreflang (en, fr, ar, x-default)
 * for routes that share the same path structure across languages.
 */
export function buildAlternates(
    path: string,
    lang: string,
    customCanonical?: string | null
): NonNullable<Metadata['alternates']> {
    const enUrl = buildAbsoluteLocalizedUrl(path, 'en');
    const frUrl = buildAbsoluteLocalizedUrl(path, 'fr');
    const arUrl = buildAbsoluteLocalizedUrl(path, 'ar');
    const defaultCanonical = lang === 'fr' ? frUrl : lang === 'ar' ? arUrl : enUrl;

    return {
        canonical: normalizeCustomCanonical(customCanonical, defaultCanonical),
        languages: {
            en: enUrl,
            fr: frUrl,
            ar: arUrl,
            'x-default': enUrl,
        },
    };
}

export interface LocalizedPaths {
    en: string;
    fr: string;
    ar: string;
}

/**
 * Builds canonical + full bidirectional hreflang (en, fr, ar, x-default)
 * for dynamic routes whose slug differs per language (e.g., products, static pages).
 */
export function buildLocalizedAlternates(
    paths: LocalizedPaths,
    lang: string,
    customCanonical?: string | null
): NonNullable<Metadata['alternates']> {
    const enUrl = buildAbsoluteLocalizedUrl(paths.en, 'en');
    const frUrl = buildAbsoluteLocalizedUrl(paths.fr, 'fr');
    const arUrl = buildAbsoluteLocalizedUrl(paths.ar, 'ar');
    const defaultCanonical = lang === 'fr' ? frUrl : lang === 'ar' ? arUrl : enUrl;

    return {
        canonical: normalizeCustomCanonical(customCanonical, defaultCanonical),
        languages: {
            en: enUrl,
            fr: frUrl,
            ar: arUrl,
            'x-default': enUrl,
        },
    };
}
