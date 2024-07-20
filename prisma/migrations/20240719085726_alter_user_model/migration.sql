-- AlterTable
ALTER TABLE "User" ADD COLUMN     "appliedHostelId" TEXT DEFAULT '',
ADD COLUMN     "appliedRoomId" TEXT DEFAULT '';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_appliedHostelId_fkey" FOREIGN KEY ("appliedHostelId") REFERENCES "Hostel"("hostelId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_appliedRoomId_fkey" FOREIGN KEY ("appliedRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;
