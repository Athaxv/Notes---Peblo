import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decode = jwt.verify(
            token, 
            process.env.JWT_SECRET!
        )
        console.log("Decoded", decode)

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}