/*
  Warnings:

  - You are about to drop the column `zipCode` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_clientId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_departmentId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "zipCode",
ADD COLUMN     "billingAddr" TEXT,
ADD COLUMN     "postalCode" TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'DE',
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "website" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "employees";

-- CreateTable
CREATE TABLE "ClientEmployee" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "departmentId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientEmployee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientEmployee" ADD CONSTRAINT "ClientEmployee_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientEmployee" ADD CONSTRAINT "ClientEmployee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
