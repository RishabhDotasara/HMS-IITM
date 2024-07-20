/*
  Warnings:

  - You are about to drop the column `appliedHostelId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `appliedRoomId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_appliedHostelId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_appliedRoomId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "appliedHostelId",
DROP COLUMN "appliedRoomId";

-- CreateTable
CREATE TABLE "Allotment" (
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "wingId" TEXT NOT NULL,

    CONSTRAINT "Allotment_pkey" PRIMARY KEY ("requestId")
);

-- AddForeignKey
ALTER TABLE "Allotment" ADD CONSTRAINT "Allotment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allotment" ADD CONSTRAINT "Allotment_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("hostelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allotment" ADD CONSTRAINT "Allotment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allotment" ADD CONSTRAINT "Allotment_wingId_fkey" FOREIGN KEY ("wingId") REFERENCES "Wing"("wingId") ON DELETE RESTRICT ON UPDATE CASCADE;
