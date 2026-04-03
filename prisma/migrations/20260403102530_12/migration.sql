/*
  Warnings:

  - You are about to drop the column `updated_at` on the `verifications` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `verifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "verifications" DROP COLUMN "updated_at",
DROP COLUMN "value",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_token_key" ON "verifications"("token");
