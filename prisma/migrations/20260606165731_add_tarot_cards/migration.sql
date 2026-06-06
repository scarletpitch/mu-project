-- CreateEnum
CREATE TYPE "Arcana" AS ENUM ('major', 'minor');

-- CreateEnum
CREATE TYPE "Suit" AS ENUM ('wands', 'cups', 'swords', 'pentacles');

-- CreateTable
CREATE TABLE "TarotCard" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameTh" TEXT,
    "arcana" "Arcana" NOT NULL,
    "suit" "Suit",
    "number" INTEGER,
    "rank" TEXT,
    "imageUrl" TEXT,
    "backImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TarotCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarotCardMeaning" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "coreMeaning" TEXT,
    "symbols" TEXT,
    "keywords" TEXT[],
    "generalSituation" TEXT,
    "personality" TEXT,
    "work" TEXT,
    "study" TEXT,
    "finance" TEXT,
    "loveAndRelationship" TEXT,
    "singleLove" TEXT,
    "health" TEXT,
    "timingSpeed" TEXT,
    "timingPeriod" TEXT,
    "timingNote" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TarotCardMeaning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TarotCard_arcana_idx" ON "TarotCard"("arcana");

-- CreateIndex
CREATE INDEX "TarotCard_suit_idx" ON "TarotCard"("suit");

-- CreateIndex
CREATE UNIQUE INDEX "TarotCardMeaning_cardId_key" ON "TarotCardMeaning"("cardId");

-- CreateIndex
CREATE INDEX "TarotCardMeaning_cardId_idx" ON "TarotCardMeaning"("cardId");

-- AddForeignKey
ALTER TABLE "TarotCardMeaning" ADD CONSTRAINT "TarotCardMeaning_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "TarotCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
