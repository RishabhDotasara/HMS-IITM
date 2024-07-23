/*
  Warnings:

  - You are about to drop the column `userId` on the `Allotment` table. All the data in the column will be lost.
  - Added the required column `creatorUserId` to the `Allotment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Allotment" DROP COLUMN "userId",
ADD COLUMN     "creatorUserId" TEXT NOT NULL;
