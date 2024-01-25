import { NextRequest } from 'next/server'
import { validate as uuidValidate } from 'uuid'
import { z } from 'zod'
import prisma from '@/lib/prisma'

/**
 * @swagger
 * /api/student/{uuid}:
 *   put:
 *     tags:
 *       - Student
 *     operationId: createStudent
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         example: 0a87fa79-c462-481b-898f-de5cf7905e0e
 *         schema:
 *           type: string
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
 *                     "message": "Success update student",
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
 *                     "message": "Failed to update student",
 *                     "data": null
 *                   }
 */
export async function PUT(req: NextRequest, param: { params: { uuid: string } }) {
  const uuid = param?.params?.uuid

  if (!uuidValidate(uuid)) {
    return Response.json(
      {
        message: 'Invalid Student ID',
        data: null,
      },
      {
        status: 400,
      }
    )
  }

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

    await prisma.student.update({
      data: {
        student_id: student_id as string,
        name: name as string,
        address: address as string,
        phone: phone as string,
        university_id: university_id as string,
      },
      where: {
        uuid,
      },
    })

    return Response.json(
      {
        message: 'Success update student',
        data: null,
      },
      {
        status: 200,
      }
    )
  } catch {
    return Response.json(
      {
        message: 'Failed to update student',
        data: null,
      },
      {
        status: 500,
      }
    )
  }
}
