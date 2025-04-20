/*
  Warnings:

  - You are about to drop the column `lastName` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `lastName1` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName2` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "lastName",
ADD COLUMN     "lastName1" TEXT NOT NULL,
ADD COLUMN     "lastName2" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
