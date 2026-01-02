import jwt from 'jsonwebtoken'

interface User {
    id: String
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export default async function accessAndRefreshToken(value: User): Promise<Tokens> {
    try {
        const accessToken = await jwt.sign(value.id, process.env.JWT_ACCESS_SECRET || "", { expiresIn: "15m" });
        const refreshToken = await jwt.sign(value.id, process.env.JWT_REFRESH_SECRET || "", { expiresIn: "7d" });

        return ({ accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        throw new Error("Could not generate tokens");
    }
}
