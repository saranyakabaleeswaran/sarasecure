/*
  Warnings:

  - Added the required column `ascii` to the `Mfa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hex` to the `Mfa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base32` to the `Mfa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otpauth_url` to the `Mfa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mfa" ADD COLUMN     "ascii" VARCHAR(255) NOT NULL,
ADD COLUMN     "hex" VARCHAR(255) NOT NULL,
ADD COLUMN     "base32" VARCHAR(255) NOT NULL,
ADD COLUMN     "otpauth_url" VARCHAR(255) NOT NULL;
