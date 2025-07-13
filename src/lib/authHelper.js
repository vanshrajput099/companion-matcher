"use server";
import { verifyAccessToken } from "@/utils/jwtToken";
import { db } from "@/utils/prisma";
import { cookies } from 'next/headers';

export const authHelper = (async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        throw new Error("Token not found");
    }

    const decodeToken = await verifyAccessToken(token);

    const user = await db.user.findUnique({
        where: {
            username: decodeToken.data.username
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return { id: user.id };
});