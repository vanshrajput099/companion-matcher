"use server";

import { authHelper } from "@/lib/authHelper";
import { apiResponse } from "@/utils/APIResponse";
import { createAccessToken } from "@/utils/jwtToken";
import { checkEncryptedPassword, encryptPassword } from "@/utils/passwordCrypter";
import { db } from "@/utils/prisma";
import { cookies } from 'next/headers';

export const createUser = async ({ username, name, age, interests, password }) => {
    try {
        if ([username, name, password].some((ele) => ele.trim() === "")) {
            return apiResponse(400, "All fields are required.", null);
        }

        const convertedAge = parseInt(age);

        if (isNaN(convertedAge)) {
            return apiResponse(400, "Age should be a number.", null);
        }

        if (!Array.isArray(interests) || interests.length === 0) {
            return apiResponse(400, "Interests are required.", null);
        }

        const checkUsername = await db.user.findUnique({
            where: { username },
        });

        if (checkUsername) {
            return apiResponse(409, "Username already exists.", null);
        }

        const hashedPassword = await encryptPassword(password);

        const createdUser = await db.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
                age: convertedAge,
                interests,
            },
        });

        if (!createdUser) {
            return apiResponse(500, "Server error while creating user.", null);
        }

        return apiResponse(201, "User created successfully!", createdUser);
    } catch (error) {
        console.error("createUser error:", error);
        return apiResponse(500, "Unexpected error occurred.", null);
    }
};

export const loginUser = async ({ username, password }) => {
    try {
        const cookieStore = cookies();

        if ([username, password].some((ele) => ele.trim() === "")) {
            return apiResponse(400, "All fields are required.", null);
        }

        const checkUsername = await db.user.findUnique({
            where: { username },
        });

        if (!checkUsername) {
            return apiResponse(404, "User not found.", null);
        }

        const checkPassword = await checkEncryptedPassword(checkUsername.password, password);

        if (!checkPassword) {
            return apiResponse(401, "Invalid credentials.", null);
        }

        const accessToken = await createAccessToken(checkUsername.id, checkUsername.username);

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
        });

        return apiResponse(200, "User logged in successfully!", checkUsername);
    } catch (error) {
        console.error("loginUser error:", error);
        return apiResponse(500, "Unexpected error occurred.", null);
    }
};

export const getUserMatches = async () => {
    try {
        const { id } = await authHelper();

        const currentUser = await db.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!currentUser) {
            return apiResponse(404, "User not found.", null);
        }

        const allUsers = await db.user.findMany({
            where: {
                username: { not: currentUser.username },
            },
        });

        const matches = allUsers.filter((user) => {
            const sharedInterests = user.interests.filter((interest) =>
                currentUser.interests.includes(interest)
            );
            return sharedInterests.length >= 2;
        });

        return apiResponse(200, "User matches fetched successfully!", matches);
    } catch (error) {
        console.error("getUserMatches error:", error);
        return apiResponse(500, "Unexpected error occurred.", null);
    }
};

export const logoutUser = async () => {
    try {
        await authHelper();
        const cookieStore = cookies();

        cookieStore.set('accessToken', '', {
            path: '/',
            maxAge: 0,
        });

        return apiResponse(200, "User logged out successfully!", null);
    } catch (error) {
        console.error("logoutUser error:", error);
        return apiResponse(500, "Unexpected error occurred.", null);
    }
};

export const searchUsingUsername = async (username) => {
    try {
        if (!username) {
            return apiResponse(400, "Username is required.", null);
        }

        const currentUser = await db.user.findUnique({
            where: { username },
        });

        if (!currentUser) {
            return apiResponse(404, "User not found.", null);
        }

        const allUsers = await db.user.findMany({
            where: {
                username: { not: currentUser.username },
            },
        });

        const matches = allUsers.filter((user) => {
            const sharedInterests = user.interests.filter((interest) =>
                currentUser.interests.includes(interest)
            );
            return sharedInterests.length >= 2;
        });

        return apiResponse(200, "Matching users fetched successfully!", matches);
    } catch (error) {
        console.error("searchUsingUsername error:", error);
        return apiResponse(500, "Unexpected error occurred.", null);
    }
};
