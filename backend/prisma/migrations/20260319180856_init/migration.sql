-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "balance_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("balance_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "children_names" TEXT[],
    "health_concerns" TEXT[],
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "payment_type" TEXT NOT NULL,
    "lesson_date" TIMESTAMP(3) NOT NULL,
    "lesson_time" TEXT NOT NULL,
    "nap_times" TEXT[],
    "point_amount" INTEGER,
    "money_amount" DECIMAL(10,2),
    "lesson_status" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_user_id_key" ON "Balance"("user_id");

-- CreateIndex
CREATE INDEX "Transaction_user_id_idx" ON "Transaction"("user_id");

-- CreateIndex
CREATE INDEX "Transaction_transaction_date_idx" ON "Transaction"("transaction_date");

-- CreateIndex
CREATE INDEX "Transaction_payment_type_idx" ON "Transaction"("payment_type");

-- CreateIndex
CREATE INDEX "Transaction_lesson_date_idx" ON "Transaction"("lesson_date");

-- CreateIndex
CREATE INDEX "Transaction_lesson_status_idx" ON "Transaction"("lesson_status");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
