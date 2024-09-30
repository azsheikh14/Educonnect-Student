import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib';

const publicPaths = ['/account/login', '/account/signup'];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('studentToken')?.value;
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isPublicPath) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    }

    const sessionResponse = await checkSession(token);
    console.log('sessionResponse :', sessionResponse);
    if (sessionResponse === false) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    }

    if (sessionResponse instanceof NextResponse) {
        return sessionResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/messages',
        '/classes',
        '/profile',
        '/teachers',
        '/settings',
        '/account/:path*',
    ],
};
