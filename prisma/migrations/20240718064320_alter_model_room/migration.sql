-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "hostelId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("hostelId") ON DELETE RESTRICT ON UPDATE CASCADE;
