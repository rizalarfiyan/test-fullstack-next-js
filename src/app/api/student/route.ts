import prisma from '@/lib/prisma'
import { GetStudent } from '@/types/api/student'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const page: number = Number(req.nextUrl.searchParams.get('page') || 1)
  const limit: number = Number(req.nextUrl.searchParams.get('limit') || 10)
  const sortBy = req.nextUrl.searchParams.get('sortBy')
  const sortOrder = req.nextUrl.searchParams.get('sortOrder')
  const search = req.nextUrl.searchParams.get('search')

  try {
    const offset = (Number(page) - 1) * Number(limit)
    const students = await prisma.student.findMany({
      skip: offset,
      take: Number(limit),
      orderBy:
        sortBy && sortOrder
          ? {
              [sortBy as string]: sortOrder as 'asc' | 'desc',
            }
          : undefined,
      where: search
        ? {
            OR: [
              { student_id: { contains: search as string } },
              { name: { contains: search as string } },
              { university: { name: { contains: search as string } } },
            ],
          }
        : undefined,
      include: {
        university: true,
      },
    })

    const totalCount = await prisma.student.count({
      where: search
        ? {
            OR: [
              { student_id: { contains: search as string } },
              { name: { contains: search as string } },
              { university: { name: { contains: search as string } } },
            ],
          }
        : undefined,
    })

    const mappedStudents: GetStudent[] = students.map((student, index) => ({
      id: student.uuid,
      increment: offset + index + 1,
      nim: student.student_id,
      name: student.name,
      university_name: student.university.name,
    }))

    return Response.json({
      code: 200,
      message: 'Success get data',
      data: mappedStudents,
      pagination: {
        limit,
        page: Number(page),
        total: totalCount,
        total_page: Math.ceil(totalCount / Number(limit)),
      },
    })
  } catch {
    return Response.json({
      code: 500,
      message: 'Something went wrong',
      data: [],
      pagination: {
        limit,
        page,
        total: 0,
      },
    })
  }
}
