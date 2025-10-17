/*
  Warnings:

  - You are about to drop the column `reservedBy` on the `bookcopy` table. All the data in the column will be lost.
  - You are about to drop the column `resevedAt` on the `bookcopy` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `fullfilledAt` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_copyId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_userId_fkey`;

-- DropIndex
DROP INDEX `Reservation_copyId_canceledAt_fullfilledAt_expiredAt_idx` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_userId_canceledAt_fullfilledAt_idx` ON `reservation`;

-- AlterTable
ALTER TABLE `book` MODIFY `title` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `bookcopy` DROP COLUMN `reservedBy`,
    DROP COLUMN `resevedAt`,
    ADD COLUMN `reservedAt` DATETIME(3) NULL,
    ADD COLUMN `reservedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `expiredAt`,
    DROP COLUMN `fullfilledAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL,
    ADD COLUMN `fulfilledAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `mfaEnabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Reservation_copyId_canceledAt_fulfilledAt_expiresAt_idx` ON `Reservation`(`copyId`, `canceledAt`, `fulfilledAt`, `expiresAt`);

-- CreateIndex
CREATE INDEX `Reservation_userId_canceledAt_fulfilledAt_idx` ON `Reservation`(`userId`, `canceledAt`, `fulfilledAt`);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_copyId_fkey` FOREIGN KEY (`copyId`) REFERENCES `BookCopy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
