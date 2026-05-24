ALTER TABLE "Profile" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "Profile" ADD COLUMN "longitude" DOUBLE PRECISION;

CREATE INDEX "Profile_latitude_longitude_idx" ON "Profile"("latitude", "longitude");
