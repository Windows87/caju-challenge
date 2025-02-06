/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_userId_companyId_key" ON "account"("userId", "companyId");
