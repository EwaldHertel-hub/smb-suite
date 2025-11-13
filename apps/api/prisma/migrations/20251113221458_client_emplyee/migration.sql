/*
  Warnings:

  - You are about to drop the column `departmentId` on the `ClientEmployee` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientEmployee" DROP CONSTRAINT "ClientEmployee_departmentId_fkey";

-- AlterTable
ALTER TABLE "ClientEmployee" DROP COLUMN "departmentId",
ADD COLUMN     "department" TEXT;

-- DropTable
DROP TABLE "Department";
