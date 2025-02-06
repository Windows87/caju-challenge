-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);
