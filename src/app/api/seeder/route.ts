import prisma from '@/lib/prisma'
import { faker } from '@faker-js/faker'

export async function GET(req: Request) {
  try {
    const universities = await prisma.university.findMany()

    const students = []
    const generateStudentId = (index: number) => `22.11.${String(index + 1).padStart(4, '0')}`

    for (let i = 0; i < 100; i++) {
      const randomUniversity = universities[Math.floor(Math.random() * universities.length)]

      const studentId = generateStudentId(i)
      const student = {
        student_id: studentId,
        name: faker.internet.userName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        university_id: randomUniversity.uuid,
      }
      students.push(student)
    }

    await prisma.student.createMany({
      data: students,
      skipDuplicates: true,
    })
    return Response.json({
      code: 201,
      message: 'Success create students',
      data: null,
    })
  } catch (error) {
    return Response.json({
      code: 500,
      message: 'Internal Server Error',
      data: null,
    })
  }
}
