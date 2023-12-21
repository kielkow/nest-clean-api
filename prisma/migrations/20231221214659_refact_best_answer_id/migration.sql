/*
  Warnings:

  - You are about to drop the column `questionId` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `bestAnswerId` on the `questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[best_answer_id]` on the table `questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question_id` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- AlterTable
ALTER TABLE "answers" DROP COLUMN "questionId",
ADD COLUMN     "question_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "bestAnswerId",
ADD COLUMN     "best_answer_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateIndex
CREATE UNIQUE INDEX "questions_best_answer_id_key" ON "questions"("best_answer_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_best_answer_id_fkey" FOREIGN KEY ("best_answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
