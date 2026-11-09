/*
  Warnings:

  - You are about to drop the column `DOB` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `EDD` on the `UserProfile` table. All the data in the column will be lost.
  - The `currentTrimester` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "DOB",
DROP COLUMN "EDD",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "estimatedDueDate" TIMESTAMP(3),
DROP COLUMN "currentTrimester",
ADD COLUMN     "currentTrimester" INTEGER;
