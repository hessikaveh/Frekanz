-- CreateTable
CREATE TABLE "WordProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "bundle" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordProgress_userId_word_key" ON "WordProgress"("userId", "word");

-- AddForeignKey
ALTER TABLE "WordProgress" ADD CONSTRAINT "WordProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
