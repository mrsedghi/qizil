/*
  Warnings:

  - You are about to drop the column `poemType` on the `poems` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[poetUrl]` on the table `poets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `poemTypeId` to the `poems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audio_files" ALTER COLUMN "url" SET DATA TYPE VARCHAR(512);

-- AlterTable
ALTER TABLE "poems" DROP COLUMN "poemType",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "poemTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "poets" ADD COLUMN     "poetUrl" VARCHAR(512);

-- DropEnum
DROP TYPE "PoemType";

-- CreateTable
CREATE TABLE "poem_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "typeUrl" VARCHAR(512),
    "poetId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poem_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "poem_types_name_poetId_key" ON "poem_types"("name", "poetId");

-- CreateIndex
CREATE INDEX "poems_order_idx" ON "poems"("order");

-- CreateIndex
CREATE UNIQUE INDEX "poets_poetUrl_key" ON "poets"("poetUrl");

-- AddForeignKey
ALTER TABLE "poem_types" ADD CONSTRAINT "poem_types_poetId_fkey" FOREIGN KEY ("poetId") REFERENCES "poets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poems" ADD CONSTRAINT "poems_poemTypeId_fkey" FOREIGN KEY ("poemTypeId") REFERENCES "poem_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
