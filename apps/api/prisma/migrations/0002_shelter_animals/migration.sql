-- CreateTable
CREATE TABLE "ShelterAnimal" (
    "id" TEXT NOT NULL,
    "pageType" TEXT NOT NULL DEFAULT 'shelter',
    "nameAz" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "eyebrowAz" TEXT,
    "eyebrowEn" TEXT,
    "altAz" TEXT,
    "altEn" TEXT,
    "thumbLabelAz" TEXT,
    "thumbLabelEn" TEXT,
    "genderLabelAz" TEXT,
    "genderLabelEn" TEXT,
    "genderValueAz" TEXT,
    "genderValueEn" TEXT,
    "birthLabelAz" TEXT,
    "birthLabelEn" TEXT,
    "birthValueAz" TEXT,
    "birthValueEn" TEXT,
    "breedLabelAz" TEXT,
    "breedLabelEn" TEXT,
    "breedValueAz" TEXT,
    "breedValueEn" TEXT,
    "colorLabelAz" TEXT,
    "colorLabelEn" TEXT,
    "colorValueAz" TEXT,
    "colorValueEn" TEXT,
    "storyAz" TEXT NOT NULL,
    "storyEn" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageFileName" TEXT NOT NULL,
    "imageOriginalName" TEXT NOT NULL,
    "imageMimeType" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShelterAnimal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShelterAnimal_pageType_sortOrder_idx" ON "ShelterAnimal"("pageType", "sortOrder");
