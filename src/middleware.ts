// This page redirects to login if user is not logged in and blocks some pages if user is not logged in

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/account/login' || path === '/account/signup'

    const cookieStore = cookies()
    const token = cookieStore.get("studentToken")?.value;

    if (isPublicPath && token) {
        // return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/account/login', request.nextUrl))
    }

}

export const config = {
    matcher: [
        '/',
        '/chat/:path*',
        '/account/login',
        '/account/signup'
    ],
}