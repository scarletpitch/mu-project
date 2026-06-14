-- CreateTable
CREATE TABLE "ReadingSession" (
    "id" TEXT NOT NULL,
    "readingType" TEXT NOT NULL,
    "category" TEXT,
    "questionText" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'test',
    "algorithmVersion" TEXT NOT NULL,
    "promptVersion" TEXT,
    "aiModel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ReadingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingCard" (
    "id" TEXT NOT NULL,
    "readingSessionId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "positionIndex" INTEGER NOT NULL,
    "positionKey" TEXT NOT NULL,
    "positionLabel" TEXT NOT NULL,
    "meaningSnapshot" JSONB NOT NULL,
    "keywordsSnapshot" TEXT[],
    "interpretationSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingOutput" (
    "id" TEXT NOT NULL,
    "readingSessionId" TEXT NOT NULL,
    "structuredOutline" JSONB NOT NULL,
    "algorithmText" TEXT,
    "aiPrompt" JSONB,
    "aiOutput" TEXT,
    "finalOutput" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalReadingReview" (
    "id" TEXT NOT NULL,
    "readingSessionId" TEXT NOT NULL,
    "ratingOverall" INTEGER,
    "ratingAccuracy" INTEGER,
    "ratingTone" INTEGER,
    "ratingUsefulness" INTEGER,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "reviewStatus" TEXT NOT NULL DEFAULT 'pending',
    "reviewNote" TEXT,
    "suggestedFix" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalReadingReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingSession_readingType_idx" ON "ReadingSession"("readingType");

-- CreateIndex
CREATE INDEX "ReadingSession_status_idx" ON "ReadingSession"("status");

-- CreateIndex
CREATE INDEX "ReadingSession_category_idx" ON "ReadingSession"("category");

-- CreateIndex
CREATE INDEX "ReadingCard_readingSessionId_idx" ON "ReadingCard"("readingSessionId");

-- CreateIndex
CREATE INDEX "ReadingCard_cardId_idx" ON "ReadingCard"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingOutput_readingSessionId_key" ON "ReadingOutput"("readingSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "InternalReadingReview_readingSessionId_key" ON "InternalReadingReview"("readingSessionId");

-- CreateIndex
CREATE INDEX "InternalReadingReview_reviewStatus_idx" ON "InternalReadingReview"("reviewStatus");

-- CreateIndex
CREATE INDEX "InternalReadingReview_isApproved_idx" ON "InternalReadingReview"("isApproved");

-- AddForeignKey
ALTER TABLE "ReadingCard" ADD CONSTRAINT "ReadingCard_readingSessionId_fkey" FOREIGN KEY ("readingSessionId") REFERENCES "ReadingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingCard" ADD CONSTRAINT "ReadingCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "TarotCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingOutput" ADD CONSTRAINT "ReadingOutput_readingSessionId_fkey" FOREIGN KEY ("readingSessionId") REFERENCES "ReadingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalReadingReview" ADD CONSTRAINT "InternalReadingReview_readingSessionId_fkey" FOREIGN KEY ("readingSessionId") REFERENCES "ReadingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
