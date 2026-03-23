/*
  Warnings:

  - A unique constraint covering the columns `[surname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "surname" VARCHAR(256) NOT NULL,
ADD COLUMN     "username" VARCHAR(256) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_surname_key" ON "User"("surname");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
