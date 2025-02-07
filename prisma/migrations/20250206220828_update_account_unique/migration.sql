-- DropIndex
DROP INDEX "account_userId_companyId_key";

-- CreateIndex
CREATE INDEX "userId_companyId" ON "account"("userId", "companyId");
