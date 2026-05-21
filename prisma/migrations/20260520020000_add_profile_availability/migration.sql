CREATE TYPE "AvailabilityPeriod" AS ENUM ('WEEKDAYS', 'WEEKENDS');

CREATE TYPE "AvailabilityTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

ALTER TABLE "Profile" ADD COLUMN "availabilityPeriods" "AvailabilityPeriod"[] DEFAULT ARRAY[]::"AvailabilityPeriod"[];
ALTER TABLE "Profile" ADD COLUMN "availabilityTimes" "AvailabilityTime"[] DEFAULT ARRAY[]::"AvailabilityTime"[];
ALTER TABLE "Profile" ADD COLUMN "availabilityNotes" TEXT;
