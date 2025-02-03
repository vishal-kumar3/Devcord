/*
  Warnings:

  - You are about to drop the column `boi` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'VOICE_NOTE', 'IMAGE', 'VIDEO', 'FILE', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isDM" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "systemData" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "senderId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "boi",
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
