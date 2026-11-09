-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "weight" TEXT,
    "height" TEXT,
    "DOB" TIMESTAMP(3),
    "EDD" TEXT,
    "currentTrimester" TEXT,
    "partner" TEXT,
    "stateOfOrigin" TEXT,
    "allergies" TEXT,
    "bloodGroup" TEXT,
    "bloodType" TEXT,
    "gravida" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);
