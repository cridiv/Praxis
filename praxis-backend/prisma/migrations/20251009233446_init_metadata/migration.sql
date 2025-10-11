-- CreateTable
CREATE TABLE "FileMetadata" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rulesUsed" JSONB,
    "classification" JSONB,
    "overallScore" DOUBLE PRECISION,
    "datasetSummary" TEXT,
    "fileUrl" TEXT,

    CONSTRAINT "FileMetadata_pkey" PRIMARY KEY ("id")
);
