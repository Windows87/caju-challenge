-- CreateTable
CREATE TABLE "balanceType" (
    "balanceTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "balanceType_pkey" PRIMARY KEY ("balanceTypeId")
);

-- CreateTable
CREATE TABLE "mcc" (
    "mccId" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "balanceTypeId" INTEGER NOT NULL,

    CONSTRAINT "mcc_pkey" PRIMARY KEY ("mccId")
);

-- CreateIndex
CREATE UNIQUE INDEX "balanceType_slug_key" ON "balanceType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "mcc_code_key" ON "mcc"("code");

-- AddForeignKey
ALTER TABLE "mcc" ADD CONSTRAINT "mcc_balanceTypeId_fkey" FOREIGN KEY ("balanceTypeId") REFERENCES "balanceType"("balanceTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
