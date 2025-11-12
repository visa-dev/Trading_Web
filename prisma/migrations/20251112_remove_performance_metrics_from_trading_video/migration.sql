-- Remove performanceMetrics column from TradingVideo since it is no longer used
ALTER TABLE "TradingVideo" DROP COLUMN IF EXISTS "performanceMetrics";

