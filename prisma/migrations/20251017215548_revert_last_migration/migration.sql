/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "imageUrls",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT 'https://placehold.co/600x600/?font=playfair-display&text=Placeholder';
