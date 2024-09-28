import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secretKey = process.env.jwt_secret;
const key = new TextEncoder().encode(secretKey);
const RENEW_THRESHOLD = 10 * 60; // 10 minutes in seconds

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h") // Expiration time adjusted to 1 hour for example
        .sign(key);
}

export async function decrypt(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null; // Token verification failed
    }
}

export async function checkSession(token: string): Promise<boolean | NextResponse> {
    const payload = await decrypt(token);

    if (!payload) {
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = payload.exp - currentTime;

    // If the token is expired
    if (timeLeft <= 0) {
        return false;
    }

    // If the token is about to expire within the threshold, renew it
    if (timeLeft < RENEW_THRESHOLD) {
        payload.exp = currentTime + 60 * 60; // 1 hour
        const newToken = await encrypt(payload);
        const res = NextResponse.next();
        res.cookies.set({
            name: "studentToken",
            value: newToken,
            httpOnly: true,
            expires: new Date(payload.exp * 1000),
        });
        return res;
    }

    return true;
}
