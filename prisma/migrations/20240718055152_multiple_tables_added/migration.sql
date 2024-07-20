-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hostelId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "roomId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Hostel" (
    "hostelId" TEXT NOT NULL,
    "hostelName" TEXT NOT NULL,
    "hostelFor" TEXT NOT NULL,
    "singleRooms" INTEGER NOT NULL,
    "doubleRooms" INTEGER NOT NULL,
    "tripleRooms" INTEGER NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("hostelId")
);

-- CreateTable
CREATE TABLE "Wing" (
    "wingId" TEXT NOT NULL,
    "wingName" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Wing_pkey" PRIMARY KEY ("wingId")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "wingId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_hostelName_key" ON "Hostel"("hostelName");

-- AddForeignKey
ALTER TABLE "Wing" ADD CONSTRAINT "Wing_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("hostelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_wingId_fkey" FOREIGN KEY ("wingId") REFERENCES "Wing"("wingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("hostelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
