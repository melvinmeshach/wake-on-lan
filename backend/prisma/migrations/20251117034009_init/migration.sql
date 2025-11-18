/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "customId" TEXT,
ALTER COLUMN "macAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device_customId_key" ON "Device"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
