-- CreateTable
CREATE TABLE "InstrumentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InstrumentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentCategory_name_key" ON "InstrumentCategory"("name");

-- Seed a fallback category so existing instruments can receive the new required relation.
INSERT INTO "InstrumentCategory" ("id", "name")
VALUES ('instrument_category_outros', 'outros');

-- Add the relation as nullable first, backfill, then enforce it.
ALTER TABLE "Instrument" ADD COLUMN "categoryId" TEXT;

UPDATE "Instrument"
SET "categoryId" = 'instrument_category_outros'
WHERE "categoryId" IS NULL;

ALTER TABLE "Instrument" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InstrumentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
