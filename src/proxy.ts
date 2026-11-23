import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const locales = ['en', 'ar', 'fr'];
const defaultLocale = 'en';

// Define the middleware function
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const localePrefixedAuthApi = locales.find(
        (locale) => pathname === `/${locale}/api/auth` || pathname.startsWith(`/${locale}/api/auth/`)
    );

    if (localePrefixedAuthApi) {
        const rewrittenPath = pathname.replace(`/${localePrefixedAuthApi}`, '');
        return NextResponse.rewrite(new URL(`${rewrittenPath}${req.nextUrl.search}`, req.url));
    }

    // 1. Locale redirection/rewrite logic
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (
        pathnameIsMissingLocale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/admin') && // Exclude admin from localized rewrite
        !pathname.startsWith('/login') && // Exclude login from localized rewrite
        !pathname.startsWith('/_next') &&
        !pathname.includes('.')
    ) {
        // Rewrite to English instead of redirecting
        const url = req.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.rewrite(url);
    }

    // 2. Auth protection (ONLY executed for admin and login routes to save CPU and function invocations)
    const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');
    const isAdminPage = pathname.startsWith('/admin');

    if (isAuthPage || isAdminPage) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const isAuth = !!token;

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL(`/admin`, req.url));
            }
            return NextResponse.next();
        }

        if (isAdminPage) {
            if (!isAuth) {
                const from = pathname + req.nextUrl.search;
                return NextResponse.redirect(
                    new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
                );
            }

            if (token?.role !== 'ADMIN') {
                return NextResponse.redirect(new URL(`/en`, req.url));
            }
        }
    }

    return NextResponse.next();
}

export default middleware;

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - /api routes
         * - /_next/static (static files)
         * - /_next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt
         * - Static file extensions (.svg, .png, .jpg, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
    ],
};
