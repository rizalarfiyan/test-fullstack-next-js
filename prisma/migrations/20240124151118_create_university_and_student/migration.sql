-- CreateTable
CREATE TABLE "University" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "University_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Student" (
    "uuid" VARCHAR(36) NOT NULL,
    "student_id" VARCHAR(16) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "phone" VARCHAR(16) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "university_id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
