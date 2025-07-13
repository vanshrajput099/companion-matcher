"use server";
import { authHelper } from "@/lib/authHelper";
import { apiResponse } from "@/utils/APIResponse";
import { createAccessToken } from "@/utils/jwtToken";
import { checkEncryptedPassword, encryptPassword } from "@/utils/passwordCrypter";
import { db } from "@/utils/prisma";
import { cookies } from 'next/headers';

export const createUser = (async ({ username, name, age, interests, password }) => {
    try {
        if ([username, name, password].some((ele) => ele.trim() === "")) {
            throw new Error("All fields required.");
        }

        const convertedAge = parseInt(age);

        if (isNaN(convertedAge)) {
            throw new Error("Age should be a number.");
        }

        if (!Array.isArray(interests) || interests.length === 0) {
            throw new Error("All fields required.");
        }

        const checkUsername = await db.user.findUnique({
            where: {
                username
            }
        });

        if (checkUsername) {
            throw new Error("Username already exists.");
        }

        const hashedPassword = await encryptPassword(password);

        const createdUser = await db.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
                age: convertedAge,
                interests
            }
        });

        if (!createdUser) {
            throw new Error("Server error while creating user");
        }

        return apiResponse(201, "User created successfully !!", createdUser);
    } catch (error) {
        throw new Error(error.message);
    }
});

export const loginUser = (async ({ username, password }) => {
    try {
        const cookieStore = cookies();

        if ([username, password].some((ele) => ele.trim() === "")) {
            throw new Error("All fields required");
        }

        const checkUsername = await db.user.findUnique({
            where: {
                username
            }
        });

        if (!checkUsername) {
            throw new Error("User not found.");
        }

        const checkPassword = await checkEncryptedPassword(checkUsername.password, password);

        if (!checkPassword) {
            throw new Error("Invalid credentials.");
        }

        const accessToken = await createAccessToken(checkUsername.id, checkUsername.username);

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
        });

        return apiResponse(201, "User Logged-In successfully !!", checkUsername)
    } catch (error) {
        throw new Error(error.message);
    }
});

export const getUserMatches = async () => {
    try {
        const { id } = await authHelper();

        const currentUser = await db.user.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        const allUsers = await db.user.findMany({
            where: {
                username: {
                    not: currentUser.username,
                },
            },
        });

        const matches = allUsers.filter((user) => {
            const sharedInterests = user.interests.filter((interest) =>
                currentUser.interests.includes(interest)
            );
            return sharedInterests.length >= 2;
        });

        return apiResponse(201, "User fetched successfully !!", matches);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const logoutUser = (async () => {
    try {
        await authHelper();

        const cookieStore = cookies();

        cookieStore.set('accessToken', '', {
            path: '/',
            maxAge: 0,
        });

        return apiResponse(201, "User logged-out successfully !!", null);
    } catch (error) {
        throw new Error(error.message);
    }
});

export const searchUsingUsername = async (username) => {
    try {
        if (!username) {
            throw new Error("Username is required");
        }

        const currentUser = await db.user.findUnique({
            where: {
                username: username
            },
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        const allUsers = await db.user.findMany({
            where: {
                username: {
                    not: currentUser.username,
                },
            },
        });

        const matches = allUsers.filter((user) => {
            const sharedInterests = user.interests.filter((interest) =>
                currentUser.interests.includes(interest)
            );
            return sharedInterests.length >= 2;
        });

        return apiResponse(201, "User fetched successfully !!", matches);
    } catch (error) {
        throw new Error(error.message);
    }
}