/*
  Warnings:

  - Added the required column `size` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
