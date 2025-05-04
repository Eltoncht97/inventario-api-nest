/*
  Warnings:

  - You are about to alter the column `cost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `ivaValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `costTotal` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discountPercent` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discountValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `utilitiesPercent` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `utilitiesValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "ivaValue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "costTotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountPercent" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discountValue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "utilitiesPercent" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "utilitiesValue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
