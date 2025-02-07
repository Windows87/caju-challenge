-- CreateTable
CREATE TABLE "transaction" (
    "transactionId" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "mccId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "merchantName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_mccId_fkey" FOREIGN KEY ("mccId") REFERENCES "mcc"("mccId") ON DELETE RESTRICT ON UPDATE CASCADE;
