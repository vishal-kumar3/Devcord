/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("messageId", "emojiId", "userId");
