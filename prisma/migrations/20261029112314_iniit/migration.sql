/*
  Warnings:

  - You are about to drop the column `bloodType` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "bloodType",
ADD COLUMN     "genoType" TEXT;
