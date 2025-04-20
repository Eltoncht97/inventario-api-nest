/*
  Warnings:

  - You are about to drop the column `deleted` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DNI', 'CUIT', 'CUIL');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deleted";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'DNI',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_document_key" ON "Customer"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
