-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_requestId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "requestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Allotment"("requestId") ON DELETE SET NULL ON UPDATE CASCADE;
