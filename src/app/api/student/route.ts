import { DEFAULT_LIMIT, DEFAULT_PAGE, SORT_DIRECTION } from '@/constants'
import prisma from '@/lib/prisma'
import { filterValidUUIDs, queryBoolean, queryInArray, queryNumber, queryString } from '@/lib/utils'
import { GetStudent } from '@/types/api/student'
import { NextRequest } from 'next/server'

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
 *             - student_id
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
 *                     "data": [
 *                       {
 *                         "id": "8be9dea9-589f-42ee-b2cb-74deadbb6029",
 *                         "sequence": 1,
 *                         "nim": "22.11.5227",
 *                         "name": "Muhamad Rizal Arfiyan",
 *                         "university_name": "Universitas Amikom Yogyakarta"
 *                       }
 *                     ],
 *                     "pagination": {
 *                       "limit": 10,
 *                       "page": 1,
 *                       "total": {
 *                         "data": 1,
 *                         "page": 1,
 *                         "deleted": 0
 *                       }
 *                     }
 *                   }
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Success get all students",
 *                     "data": [],
 *                     "pagination": {
 *                       "limit": 10,
 *                       "page": 1,
 *                       "total": {
 *                         "data": 0,
 *                         "page": 0,
 *                         "deleted": 0
 *                       }
 *                     }
 *                   }
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = queryNumber(DEFAULT_PAGE, params.get('page'))
  const limit = queryNumber(DEFAULT_LIMIT, params.get('limit'))
  const sortBy = queryInArray(SORT_DIRECTION, params.get('sort_by'))
  const sortOrder = queryInArray(['student_id', 'name', 'university_name'], params.get('sort_order'))
  const studentId = queryString(params.get('student_id'))
  const name = queryString(params.get('name'))
  const universityName = queryString(params.get('university_name'))
  const isDeleted = queryBoolean(params.get('is_deleted'))

  try {
    const offset = (page - 1) * limit

    const students = await prisma.student.findMany({
      skip: offset,
      take: limit,
      ...(sortBy && sortOrder
        ? {
            orderBy: {
              [sortBy]: sortOrder,
            },
          }
        : {}),
      where: {
        ...(isDeleted ? { NOT: [{ deletedAt: null }] } : { AND: [{ deletedAt: null }] }),
        ...(studentId || name || universityName
          ? {
              OR: [
                ...(studentId ? [{ student_id: { contains: studentId } }] : []),
                ...(name ? [{ name: { contains: name } }] : []),
                ...(universityName ? [{ university: { name: { contains: universityName } } }] : []),
              ],
            }
          : {}),
      },
      include: {
        university: true,
      },
    })

    const totalData = await prisma.student.count({
      where: {
        ...(isDeleted ? { NOT: [{ deletedAt: null }] } : { AND: [{ deletedAt: null }] }),
        ...(studentId || name || universityName
          ? {
              OR: [
                ...(studentId ? [{ student_id: { contains: studentId } }] : []),
                ...(name ? [{ name: { contains: name } }] : []),
                ...(universityName ? [{ university: { name: { contains: universityName } } }] : []),
              ],
            }
          : {}),
      },
    })

    const totalDeleted = await prisma.student.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    })

    const mappStudents: GetStudent[] = students.map((student, index) => ({
      id: student.uuid,
      sequence: offset + index + 1,
      nim: student.student_id,
      name: student.name,
      university_name: student.university.name,
    }))

    return Response.json({
      message: 'Success get all students',
      data: mappStudents,
      pagination: {
        limit,
        page: Number(page),
        total: {
          data: totalData,
          page: Math.ceil(totalData / Number(limit)),
          deleted: totalDeleted,
        },
      },
    })
  } catch {
    return Response.json({
      message: 'Success get all students',
      data: [],
      pagination: {
        limit,
        page,
        total: 0,
      },
    })
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
      return Response.json({
        message: 'Nothing to delete students',
        data: null,
      })
    }

    let count = 0
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

    return Response.json({
      message: `Success delete ${count} students`,
      data: null,
    })
  } catch {
    return Response.json({
      message: 'Failed to delete students',
      data: null,
    })
  }
}
