import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Proxy ONLY runs on /admin and /login routes (public locale routing is handled
// at the Vercel Edge CDN via next.config.ts rewrites for 0ms Fluid Active CPU).
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');
    const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');

    if (isAuthPage || isAdminPage) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const isAuth = !!token;

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/admin', req.url));
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
                return NextResponse.redirect(new URL('/', req.url));
            }
        }
    }

    return NextResponse.next();
}

export default proxy;

export const config = {
    matcher: ['/admin', '/admin/:path*', '/login', '/login/:path*'],
};
