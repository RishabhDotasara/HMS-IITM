/*
  Warnings:

  - You are about to drop the column `allocatmentDone` on the `Hostel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hostel" DROP COLUMN "allocatmentDone",
ADD COLUMN     "allotmentDone" BOOLEAN NOT NULL DEFAULT false;
