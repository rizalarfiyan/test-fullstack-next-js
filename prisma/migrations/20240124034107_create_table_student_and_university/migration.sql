-- CreateTable
CREATE TABLE "University" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "University_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Student" (
    "uuid" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "university_id" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
