-- AlterTable
ALTER TABLE "Mfa" ALTER COLUMN "verificationPin" DROP NOT NULL,
ALTER COLUMN "answer" DROP NOT NULL;
