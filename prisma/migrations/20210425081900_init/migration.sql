/*
  Warnings:

  - You are about to drop the `Questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mfa" DROP CONSTRAINT "Mfa_questionsId_fkey";

-- DropTable
DROP TABLE "Questions";

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mfa" ADD FOREIGN KEY ("questionsId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
