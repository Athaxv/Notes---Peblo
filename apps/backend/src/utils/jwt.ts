import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export const genereateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
};

