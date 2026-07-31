/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE "technicianProfiles" ALTER COLUMN "userName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(14);
