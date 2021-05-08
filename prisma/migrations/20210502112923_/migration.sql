/*
  Warnings:

  - You are about to drop the `Mfa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhisingData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mfa" DROP CONSTRAINT "Mfa_questionsId_fkey";

-- DropForeignKey
ALTER TABLE "Mfa" DROP CONSTRAINT "Mfa_userId_fkey";

-- DropTable
DROP TABLE "Mfa";

-- DropTable
DROP TABLE "PhisingData";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" VARCHAR(55) NOT NULL,
    "lastName" VARCHAR(55) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isMFAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "location" VARCHAR(255) NOT NULL,
    "authenticatedPcOrMobileName" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfas" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isVerificationPin" BOOLEAN NOT NULL DEFAULT false,
    "isOtp" BOOLEAN NOT NULL DEFAULT false,
    "isAuthenticatorApp" BOOLEAN NOT NULL DEFAULT false,
    "isSecurityQuestion" BOOLEAN NOT NULL DEFAULT false,
    "isEmailNotification" BOOLEAN NOT NULL DEFAULT false,
    "verificationPin" VARCHAR(6),
    "questionsId" INTEGER,
    "answer" VARCHAR(255),
    "ascii" VARCHAR(255),
    "hex" VARCHAR(255),
    "base32" VARCHAR(255),
    "otpauth_url" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phisingdata" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mfas.userId_unique" ON "mfas"("userId");

-- AddForeignKey
ALTER TABLE "mfas" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfas" ADD FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
