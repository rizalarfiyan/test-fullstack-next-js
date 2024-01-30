import { DEFAULT_PAGE } from '@/constants'
import prisma from '@/lib/prisma'
import { queryNumber } from '@/lib/utils'
import { faker } from '@faker-js/faker'
import { NextRequest } from 'next/server'

export const dynamic = 'auto'

/**
 * @swagger
 * /api/seeder:
 *   get:
 *     tags:
 *       - Seeder
 *     operationId: executeSeeder
 *     parameters:
 *       - name: long
 *         in: query
 *         required: false
 *         example: 20
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success create students",
 *                     "data": null
 *                   }
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Something when wrong",
 *                     "data": null
 *                   }
 */
export async function GET(req: NextRequest) {
  try {
    const long = queryNumber(DEFAULT_PAGE, req.nextUrl.searchParams.get('long'))
    const universities = await prisma.university.findMany()
    const students = []
    const generateStudentId = (index: number) => `22.11.${String(index + 1).padStart(4, '0')}`

    for (let i = 0; i < long; i++) {
      const randomUniversity = universities[Math.floor(Math.random() * universities.length)]
      students.push({
        student_id: generateStudentId(i),
        name: faker.person.fullName(),
        phone: faker.phone.number('62###########'),
        address: faker.location.streetAddress(),
        university_id: randomUniversity.uuid,
      })
    }

    await prisma.student.createMany({
      data: students,
      skipDuplicates: true,
    })
    return Response.json({
      message: 'Success create students',
      data: null,
    })
  } catch (error) {
    return Response.json({
      message: 'Something when wrong',
      data: null,
    })
  }
}
