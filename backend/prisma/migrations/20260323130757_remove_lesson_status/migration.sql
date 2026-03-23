/*
  Warnings:

  - You are about to drop the column `lesson_status` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Transaction_lesson_status_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "lesson_status";
