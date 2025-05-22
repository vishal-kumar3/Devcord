/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `burstCount` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `burstMe` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `me` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId,emojiId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Reaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "burstCount",
DROP COLUMN "burstMe",
DROP COLUMN "me",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_ReactionUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReactionUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReactionUsers_B_index" ON "_ReactionUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_messageId_emojiId_key" ON "Reaction"("messageId", "emojiId");

-- AddForeignKey
ALTER TABLE "_ReactionUsers" ADD CONSTRAINT "_ReactionUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReactionUsers" ADD CONSTRAINT "_ReactionUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
