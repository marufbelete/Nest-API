/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `user_rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_rooms_userId_roomId_key" ON "user_rooms"("userId", "roomId");
