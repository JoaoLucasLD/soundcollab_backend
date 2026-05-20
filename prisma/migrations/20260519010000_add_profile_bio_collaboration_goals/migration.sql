-- CreateEnum
CREATE TYPE "CollaborationGoal" AS ENUM ('BAND', 'RECORDING', 'LIVE_SHOWS', 'COMPOSITION', 'PRODUCTION', 'STUDY', 'CASUAL_JAM');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "bio" TEXT;
ALTER TABLE "Profile" ADD COLUMN "collaborationGoals" "CollaborationGoal"[] DEFAULT ARRAY[]::"CollaborationGoal"[];
