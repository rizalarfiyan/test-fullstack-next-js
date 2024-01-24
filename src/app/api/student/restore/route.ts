import prisma from '@/lib/prisma'
import { filterValidUUIDs } from '@/lib/utils'

/**
 * @swagger
 * /api/student/restore:
 *   post:
 *     tags:
 *       - Student
 *     operationId: restoreSoftDeleteStudents
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
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success restore {number} students",
 *                     "data": null
 *                   }
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Failed to restore students",
 *                     "data": null
 *                   }
 */
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const ids = filterValidUUIDs(data?.['ids'] || [])

    if (ids.length === 0) {
      return Response.json({
        message: 'Nothing to restore students',
        data: null,
      })
    }

    const row = await prisma.student.updateMany({
      data: {
        deletedAt: null,
      },
      where: {
        uuid: {
          in: ids,
        },
      },
    })

    const count = row.count
    return Response.json({
      message: `Success restore ${count} students`,
      data: null,
    })
  } catch {
    return Response.json({
      message: 'Failed to restore students',
      data: null,
    })
  }
}
