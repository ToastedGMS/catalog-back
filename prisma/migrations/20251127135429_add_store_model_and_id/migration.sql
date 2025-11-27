/*
  Warnings:

  - Added the required column `storeId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- ----------------------------------------------------
-- STEP 1: ADD NULLABLE COLUMNS AND CREATE STORE TABLE
-- ----------------------------------------------------

-- AlterTable: Add columns as NULLable to existing tables
ALTER TABLE "public"."Category" ADD COLUMN "storeId" INTEGER;

ALTER TABLE "public"."Product" ADD COLUMN "storeId" INTEGER;

ALTER TABLE "public"."User" ADD COLUMN "role" TEXT,
ADD COLUMN "storeId" INTEGER;

-- CreateTable: Store table with required NOT NULL constraints
CREATE TABLE "public"."Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'https://placehold.co/150x150/?font=playfair-display&text=Placeholder',
    "whatsapp" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_key" ON "public"."Store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "public"."Store"("slug");


-- ----------------------------------------------------
-- STEP 2: DATA POPULATION (CRITICAL STEP)
-- ----------------------------------------------------

-- 1. Insert a default store. Use RETURNING to confirm the ID (assumed to be 1).
INSERT INTO "public"."Store" ("name", "slug", "color", "whatsapp")
VALUES ('Initial Default Shop', 'initial-default-shop', '#4a90e2', '551100000000')
RETURNING "id";

-- 2. Update existing records, linking them to the new store (assuming ID 1)
UPDATE "public"."Category" SET "storeId" = 1 WHERE "storeId" IS NULL;
UPDATE "public"."Product" SET "storeId" = 1 WHERE "storeId" IS NULL;

-- 3. Update User records: set storeId and give a default role
UPDATE "public"."User"
  SET "storeId" = 1,
      "role" = 'ADMIN'
  WHERE "storeId" IS NULL OR "role" IS NULL;


-- ----------------------------------------------------
-- STEP 3: ENFORCE NOT NULL CONSTRAINTS AND ADD FOREIGN KEYS
-- ----------------------------------------------------

-- Enforce NOT NULL constraint now that data exists
ALTER TABLE "public"."Category" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "public"."Product" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "public"."User"
  ALTER COLUMN "role" SET NOT NULL,
  ALTER COLUMN "storeId" SET NOT NULL;

-- AddForeignKey (This is safe now because the data exists and is NOT NULL)
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;