import { DEFAULT_LIMIT, DEFAULT_PAGE, SORT_DIRECTION } from '@/constants'
import prisma from '@/lib/prisma'
import { filterValidUUIDs, queryBoolean, queryInArray, queryNumber, queryString } from '@/lib/utils'
import { QueryOrder } from '@/types/api'
import { StudentResponse } from '@/types/api/student'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-static'

/**
 * @swagger
 * /api/student:
 *   get:
 *     tags:
 *       - Student
 *     operationId: getAllStudents
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         example: 1
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         required: false
 *         example: 10
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum:
 *             - sequence
 *             - nim
 *             - name
 *             - university_name
 *       - name: student_id
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: university_name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: is_deleted
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success get all students",
 *                     "data": {
 *                       "content": [
 *                         {
 *                           "id": "8be9dea9-589f-42ee-b2cb-74deadbb6029",
 *                           "sequence": 1,
 *                           "nim": "22.11.5227",
 *                           "name": "Muhamad Rizal Arfiyan",
 *                           "phone": "08xxxxxxxxxxxx",
 *                           "address": "Jln. Pegangsaan Timur No. 56",
 *                           "university_id": "0ccd428a-b82c-47ca-abfc-0db6d7df5666",
 *                           "university_name": "Universitas Amikom Yogyakarta"
 *                         }
 *                       ],
 *                       "metadata": {
 *                         "limit": 10,
 *                         "page": 1,
 *                         "total": {
 *                           "data": 1,
 *                           "page": 1,
 *                           "delete": 0
 *                         }
 *                       }
 *                     }
 *                   }
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Success get all students",
 *                     "data": {
 *                       "content": [],
 *                       "metadata": {
 *                         "limit": 10,
 *                         "page": 1,
 *                         "total": {
 *                           "data": 0,
 *                           "page": 0,
 *                           "delete": 0
 *                         }
 *                       }
 *                     }
 *                   }
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = queryNumber(DEFAULT_PAGE, params.get('page'))
  const limit = queryNumber(DEFAULT_LIMIT, params.get('limit'))
  const sortBy = queryInArray(SORT_DIRECTION, params.get('sort_by')) as QueryOrder | null
  const sortOrder = queryInArray(['sequence', 'nim', 'name', 'university_name'], params.get('sort_order'))
  const studentId = queryString(params.get('student_id'))
  const name = queryString(params.get('name'))
  const universityName = queryString(params.get('university_name'))
  const isDeleted = queryBoolean(params.get('is_deleted'))

  try {
    const offset = (page - 1) * limit

    const where = {
      ...(isDeleted ? { NOT: [{ deletedAt: null }] } : {}),
      ...(studentId || name || universityName || !isDeleted
        ? {
            AND: [
              ...(studentId ? [{ student_id: { contains: studentId } }] : []),
              ...(name ? [{ name: { contains: name } }] : []),
              ...(universityName ? [{ university: { name: { contains: universityName } } }] : []),
              ...(!isDeleted ? [{ deletedAt: null }] : []),
            ],
          }
        : {}),
    }

    const getSortData = () => {
      if (!sortBy) return { createdAt: 'asc' as QueryOrder }
      switch (sortOrder) {
        case 'nim':
          return { student_id: sortBy }
        case 'name':
          return { name: sortBy }
        case 'university_name':
          return { university: { name: sortBy } }
        default:
          return { createdAt: sortBy }
      }
    }

    const students = await prisma.student.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        ...getSortData(),
      },
      where,
      include: {
        university: true,
      },
    })

    const totalData = await prisma.student.count({
      where,
    })

    const totalDeleted = await prisma.student.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    })

    const mapStudents: StudentResponse[] = students.map((student, index) => ({
      id: student.uuid,
      sequence: offset + index + 1,
      nim: student.student_id,
      name: student.name,
      phone: student.phone,
      address: student.address,
      university_id: student.university.uuid,
      university_name: student.university.name,
    }))

    return Response.json(
      {
        message: 'Success get all students',
        data: {
          content: mapStudents,
          metadata: {
            limit,
            page: Number(page),
            total: {
              data: totalData,
              page: Math.ceil(totalData / Number(limit)),
              deleted: totalDeleted,
            },
          },
        },
      },
      {
        status: 200,
      }
    )
  } catch {
    return Response.json(
      {
        message: 'Success get all students',
        data: [],
        pagination: {
          limit,
          page,
          total: {
            data: 0,
            page: 0,
            deleted: 0,
          },
        },
      },
      {
        status: 200,
      }
    )
  }
}

/**
 * @swagger
 * /api/student:
 *   delete:
 *     tags:
 *       - Student
 *     operationId: deleteStudents
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_force_delete:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success delete {number} students",
 *                     "data": null
 *                   }
 *       '422':
 *         description: Not Process Error
 *         content:
 *           application/json:
 *             examples:
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Nothing to delete students",
 *                     "data": null
 *                   }
 *       '500':
 *         description: Server Error
 *         content:
 *           application/json:
 *             examples:
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Failed to delete students",
 *                     "data": null
 *                   }
 */
export async function DELETE(req: Request) {
  try {
    const data = await req.json()
    const ids = filterValidUUIDs(data?.['ids'] || [])
    const isForceDelete = data?.['is_force_delete'] || false

    if (ids.length === 0) {
      return Response.json(
        {
          message: 'Nothing to delete students',
          data: null,
        },
        {
          status: 422,
        }
      )
    }

    let count: number
    if (isForceDelete) {
      const row = await prisma.student.deleteMany({
        where: {
          uuid: {
            in: ids,
          },
        },
      })
      count = row.count
    } else {
      const row = await prisma.student.updateMany({
        data: {
          deletedAt: new Date(),
        },
        where: {
          uuid: {
            in: ids,
          },
        },
      })
      count = row.count
    }

    return Response.json(
      {
        message: `Success delete ${count} students`,
        data: null,
      },
      {
        status: 200,
      }
    )
  } catch {
    return Response.json(
      {
        message: 'Failed to delete students',
        data: null,
      },
      {
        status: 500,
      }
    )
  }
}

/**
 * @swagger
 * /api/student:
 *   post:
 *     tags:
 *       - Student
 *     operationId: createStudent
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                   type: string
 *               name:
 *                   type: string
 *               phone:
 *                   type: string
 *               address:
 *                   type: string
 *               university_id:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success create student",
 *                     "data": null
 *                   }
 *       '400':
 *         description: Bad Request Error
 *         content:
 *           application/json:
 *             examples:
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Name is invalid",
 *                     "data": null
 *                   }
 *       '422':
 *         description: Not Process Error
 *         content:
 *           application/json:
 *             examples:
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "University not found",
 *                     "data": null
 *                   }
 *       '500':
 *         description: Server Error
 *         content:
 *           application/json:
 *             examples:
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Failed to create student",
 *                     "data": null
 *                   }
 */
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const studentSchema = z.object({
      student_id: z.string().min(6).max(16),
      name: z.string().min(3).max(64),
      phone: z.string().min(10).max(16),
      address: z.string().min(1).max(255),
      university_id: z.string().uuid(),
    })

    const validate = studentSchema.safeParse(data)
    if (!validate.success) {
      return Response.json(
        {
          message: validate.error.message,
          data: null,
        },
        {
          status: 400,
        }
      )
    }

    const { student_id, phone, name, address, university_id } = data
    const isFound = await prisma.university.findUnique({
      where: {
        uuid: university_id,
      },
    })

    if (!isFound?.uuid) {
      return Response.json(
        {
          message: 'University not found',
          data: null,
        },
        {
          status: 422,
        }
      )
    }

    await prisma.student.create({
      data: {
        student_id,
        name,
        address,
        phone,
        university_id,
      },
    })

    return Response.json(
      {
        message: 'Success create student',
        data: null,
      },
      {
        status: 200,
      }
    )
  } catch {
    return Response.json(
      {
        message: 'Failed to create student',
        data: null,
      },
      {
        status: 500,
      }
    )
  }
}
