/*
  Warnings:

  - A unique constraint covering the columns `[creatorUserId]` on the table `Allotment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Allotment_creatorUserId_key" ON "Allotment"("creatorUserId");
