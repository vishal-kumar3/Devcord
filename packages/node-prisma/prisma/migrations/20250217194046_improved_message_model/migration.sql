/*
  Warnings:

  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `emoji` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - Added the required column `emojiId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emojiName` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmbedType" AS ENUM ('RICH', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'LINK');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "emoji",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "burstCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "burstMe" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emojiId" VARCHAR(20) NOT NULL,
ADD COLUMN     "emojiName" VARCHAR(32) NOT NULL,
ADD COLUMN     "me" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("messageId", "emojiId", "emojiName");

-- DropEnum
DROP TYPE "MessageType";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "filename" VARCHAR(260) NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "proxyUrl" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "contentType" VARCHAR(100) NOT NULL,
    "flags" INTEGER,
    "placeholder" TEXT,
    "placeholderVersion" INTEGER,
    "title" VARCHAR(100),
    "contentScanVersion" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embed" (
    "id" SERIAL NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "EmbedType" NOT NULL,
    "contentScanVersion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedField" (
    "id" SERIAL NOT NULL,
    "embedId" INTEGER NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "value" TEXT NOT NULL,
    "inline" BOOLEAN,

    CONSTRAINT "EmbedField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- CreateIndex
CREATE INDEX "Attachment_contentType_idx" ON "Attachment"("contentType");

-- CreateIndex
CREATE INDEX "Embed_messageId_idx" ON "Embed"("messageId");

-- CreateIndex
CREATE INDEX "Embed_type_idx" ON "Embed"("type");

-- CreateIndex
CREATE INDEX "EmbedField_embedId_idx" ON "EmbedField"("embedId");

-- CreateIndex
CREATE INDEX "Reaction_emojiId_emojiName_idx" ON "Reaction"("emojiId", "emojiName");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedField" ADD CONSTRAINT "EmbedField_embedId_fkey" FOREIGN KEY ("embedId") REFERENCES "Embed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
