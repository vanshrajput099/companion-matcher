import jwt from "jsonwebtoken";

export const createAccessToken = async (id, username) => {
    return await jwt.sign({
        data: { id, username },
    }, process.env.ACCESS_TOKEN_CODE, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY.toString() });
}

export const verifyAccessToken = async (token) => {
    return await jwt.verify(token, process.env.ACCESS_TOKEN_CODE);
}