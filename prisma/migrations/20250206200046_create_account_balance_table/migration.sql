-- CreateTable
CREATE TABLE "accountBalance" (
    "accountBalanceId" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "balanceTypeId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "accountBalance_pkey" PRIMARY KEY ("accountBalanceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "accountBalance_accountId_balanceTypeId_key" ON "accountBalance"("accountId", "balanceTypeId");

-- AddForeignKey
ALTER TABLE "accountBalance" ADD CONSTRAINT "accountBalance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountBalance" ADD CONSTRAINT "accountBalance_balanceTypeId_fkey" FOREIGN KEY ("balanceTypeId") REFERENCES "balanceType"("balanceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
