-- AlterTable
ALTER TABLE "Mfa" ALTER COLUMN "ascii" DROP NOT NULL,
ALTER COLUMN "hex" DROP NOT NULL,
ALTER COLUMN "base32" DROP NOT NULL,
ALTER COLUMN "otpauth_url" DROP NOT NULL;
