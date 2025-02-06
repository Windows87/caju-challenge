-- CreateTable
CREATE TABLE "merchant" (
    "merchantId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mccId" INTEGER NOT NULL,

    CONSTRAINT "merchant_pkey" PRIMARY KEY ("merchantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchant_name_key" ON "merchant"("name");

-- AddForeignKey
ALTER TABLE "merchant" ADD CONSTRAINT "merchant_mccId_fkey" FOREIGN KEY ("mccId") REFERENCES "mcc"("mccId") ON DELETE RESTRICT ON UPDATE CASCADE;
