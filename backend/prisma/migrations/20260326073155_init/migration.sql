-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SINGLE_LESSON', 'CREDIT_PACK');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "surname" VARCHAR(256) NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "balance_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("balance_id")
);

-- CreateTable
CREATE TABLE "Child" (
    "child_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "experience_level" VARCHAR(64) NOT NULL,
    "medical_flags" TEXT[],
    "additional_notes" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("child_id")
);

-- CreateTable
CREATE TABLE "NapTime" (
    "nap_time_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NapTime_pkey" PRIMARY KEY ("nap_time_id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "lesson_id" TEXT NOT NULL,
    "class_name" VARCHAR(256) NOT NULL,
    "instructor" VARCHAR(256) NOT NULL,
    "lesson_date" TIMESTAMP(3) NOT NULL,
    "lesson_time" VARCHAR(5) NOT NULL,
    "duration_min" INTEGER NOT NULL DEFAULT 30,
    "max_capacity" INTEGER NOT NULL DEFAULT 4,
    "price_rands" DECIMAL(10,2) NOT NULL,
    "age_group" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("lesson_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "amount_rands" DECIMAL(10,2) NOT NULL,
    "credits_added" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_user_id_key" ON "Balance"("user_id");

-- CreateIndex
CREATE INDEX "Child_user_id_idx" ON "Child"("user_id");

-- CreateIndex
CREATE INDEX "NapTime_child_id_idx" ON "NapTime"("child_id");

-- CreateIndex
CREATE INDEX "Lesson_lesson_date_idx" ON "Lesson"("lesson_date");

-- CreateIndex
CREATE INDEX "Lesson_age_group_idx" ON "Lesson"("age_group");

-- CreateIndex
CREATE INDEX "Booking_lesson_id_idx" ON "Booking"("lesson_id");

-- CreateIndex
CREATE INDEX "Booking_child_id_idx" ON "Booking"("child_id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_child_id_lesson_id_key" ON "Booking"("child_id", "lesson_id");

-- CreateIndex
CREATE INDEX "Payment_user_id_idx" ON "Payment"("user_id");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NapTime" ADD CONSTRAINT "NapTime_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("child_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
