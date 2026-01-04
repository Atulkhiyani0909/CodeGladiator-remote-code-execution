/*
  Warnings:

  - You are about to drop the column `BattleId` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_BattleId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "BattleId";
