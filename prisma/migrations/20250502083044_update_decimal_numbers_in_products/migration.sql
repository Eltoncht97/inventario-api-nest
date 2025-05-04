/*
  Warnings:

  - You are about to alter the column `cost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `ivaValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `costTotal` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountPercent` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discountValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `utilitiesPercent` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `utilitiesValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "ivaValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "costTotal" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountPercent" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discountValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "utilitiesPercent" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "utilitiesValue" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
