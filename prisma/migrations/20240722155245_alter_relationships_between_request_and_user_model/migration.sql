-- DropForeignKey
ALTER TABLE "Allotment" DROP CONSTRAINT "Allotment_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "requestId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Allotment"("requestId") ON DELETE RESTRICT ON UPDATE CASCADE;
