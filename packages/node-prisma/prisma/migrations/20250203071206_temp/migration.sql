-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_prevSender_idx" ON "Message"("conversationId", "createdAt", "prevSender");
