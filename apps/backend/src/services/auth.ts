import { UserRepository } from "../repositories/user"
import { comparePassword, hashPassword } from "../utils/password"
import { generateRefreshToken, genereateAccessToken } from "../utils/jwt"

export const AuthService = {
    async register(body: { email: string, password: string }) {
        const existing = await UserRepository.findByEmail(body.email)

        if (existing) {
            throw new Error("User already exists")
        }

        const hashed = await hashPassword(body.password)

        const user = await UserRepository.create(body.email, hashed)

        return user;
    },
    async login(body: { email: string, password: string }){
        const existing = await UserRepository.findByEmail(body.email)

        if (!existing) throw new Error("No user exists with this email")

        const valid = await comparePassword(body.password, existing.password);
        if (!valid) {
            throw new Error("Invalid Credentials");
        }

        const access_token = genereateAccessToken(existing.id)
        const refresh_token = generateRefreshToken(existing.id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    }
}