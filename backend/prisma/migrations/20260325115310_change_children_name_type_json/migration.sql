/*
  Warnings:

  - Changed the type of `children_names` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "children_names",
ADD COLUMN     "children_names" JSONB NOT NULL;
