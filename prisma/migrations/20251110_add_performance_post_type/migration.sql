-- CreateEnum
CREATE TYPE "PerformancePostType" AS ENUM ('PERFORMANCE', 'ANALYTICS');

-- AlterTable
ALTER TABLE "PerformancePost"
  ADD COLUMN "type" "PerformancePostType" NOT NULL DEFAULT 'PERFORMANCE';


