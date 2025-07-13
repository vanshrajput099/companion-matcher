import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
    const saltRounds = 13;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const checkEncryptedPassword = async (hashedPassword, password) => {
    return await bcrypt.compare(password, hashedPassword);
}