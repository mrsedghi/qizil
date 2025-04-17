/*
  Warnings:

  - You are about to drop the column `birthDate` on the `poets` table. All the data in the column will be lost.
  - You are about to drop the column `deathDate` on the `poets` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `poets` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `poets` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `poets` table. All the data in the column will be lost.
  - You are about to drop the `_PoemToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `poemType` to the `poems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `century` to the `poets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PoemType" AS ENUM ('GHAZAL', 'GHASIDEH', 'ROBBAEI', 'DOBEITI', 'HEJAI', 'MASNAVI', 'OTHER');

-- DropForeignKey
ALTER TABLE "_PoemToTag" DROP CONSTRAINT "_PoemToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PoemToTag" DROP CONSTRAINT "_PoemToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_poemId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- AlterTable
ALTER TABLE "poems" ADD COLUMN     "poemType" "PoemType" NOT NULL;

-- AlterTable
ALTER TABLE "poets" DROP COLUMN "birthDate",
DROP COLUMN "deathDate",
DROP COLUMN "imageUrl",
DROP COLUMN "language",
DROP COLUMN "region",
ADD COLUMN     "century" VARCHAR(20) NOT NULL;

-- DropTable
DROP TABLE "_PoemToTag";

-- DropTable
DROP TABLE "favorites";

-- DropTable
DROP TABLE "tags";
