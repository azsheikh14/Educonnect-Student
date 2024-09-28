import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib';

const publicPaths = ['/account/login', '/account/signup'];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('studentToken')?.value;
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // If the path is public, proceed without checking the token
    if (isPublicPath) {
        return NextResponse.next();
    }

    // If the token is missing, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    }

    // If the token is invalid, redirect to login
    const sessionResponse = await checkSession(token);
    if (sessionResponse === false) {
        return NextResponse.redirect(new URL('/account/login', request.url));
    }

    // If the sessionResponse is a response object, it means the token was renewed
    if (sessionResponse instanceof NextResponse) {
        return sessionResponse;
    }

    // If the token is valid, proceed to the requested path
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/messages',
        '/profile',
        '/settings',
        '/account/:path*',
    ],
};
