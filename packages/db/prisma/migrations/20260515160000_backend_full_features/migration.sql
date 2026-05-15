-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN IF NOT EXISTS "aiGeneratedAt" TIMESTAMP(3);

-- RefreshToken: migrate to hashed tokens with expiry
ALTER TABLE "RefreshToken" DROP COLUMN IF EXISTS "token";
ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "tokenHash" TEXT;
ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "revokedAt" TIMESTAMP(3);

-- Clear old refresh tokens (incompatible format)
DELETE FROM "RefreshToken";

ALTER TABLE "RefreshToken" ALTER COLUMN "tokenHash" SET NOT NULL;
ALTER TABLE "RefreshToken" ALTER COLUMN "expiresAt" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx" ON "RefreshToken"("userId");
