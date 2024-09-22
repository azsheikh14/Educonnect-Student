"use server"
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
    userId: string;
    // Add other properties as needed
}

export const getDataFromToken = (): string | undefined => {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('studentToken')?.value;

        if (!token) {
            throw new Error('No token found in cookies');
        }

        const decodedToken = jwt.verify(token, process.env.jwt_secret!) as DecodedToken;

        return decodedToken.userId;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Token verification error:', error.message);
        } else {
            console.error('Unknown error during token verification');
        }
    }
};
