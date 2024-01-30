import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants'
import prisma from '@/lib/prisma'
import { queryNumber, queryString } from '@/lib/utils'
import { NextRequest } from 'next/server'

/**
 * @swagger
 * /api/university:
 *   get:
 *     tags:
 *       - University
 *     operationId: getAllUniversities
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
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 value: |
 *                   {
 *                     "message": "Success get all university",
 *                     "data": {
 *                       "content": [
 *                         {
 *                           "id": "8be9dea9-589f-42ee-b2cb-74deadbb6029",
 *                           "sequence": 1,
 *                           "nim": "22.11.5227",
 *                           "name": "Muhamad Rizal Arfiyan",
 *                           "university_name": "Universitas Amikom Yogyakarta"
 *                         }
 *                       ],
 *                       "metadata": {
 *                         "limit": 10,
 *                         "page": 1,
 *                         "total": 0
 *                       }
 *                     }
 *                   }
 *               Error:
 *                 value: |
 *                   {
 *                     "message": "Success get all university",
 *                     "data": {
 *                       "content": [],
 *                       "metadata": {
 *                         "limit": 10,
 *                         "page": 1,
 *                         "total": 0
 *                       }
 *                     }
 *                   }
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = queryNumber(DEFAULT_PAGE, params.get('page'))
  const limit = queryNumber(DEFAULT_LIMIT, params.get('limit'))
  const search = queryString(params.get('search'))

  try {
    const offset = (page - 1) * limit
    const where = {
      AND: {
        ...(search ? { name: { contains: search }, address: { contains: search } } : {}),
        deletedAt: null,
      },
    }

    const universities = await prisma.university.findMany({
      skip: offset,
      take: limit,
      where,
    })

    const totalData = await prisma.university.count({
      where,
    })

    const mapUniversities = universities.map((university) => ({
      id: university.uuid,
      name: university.name,
      address: university.address,
    }))

    return Response.json(
      {
        message: 'Success get all university',
        data: {
          content: mapUniversities,
          metadata: {
            limit,
            page: Number(page),
            total: totalData,
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
        message: 'Success get all university',
        data: [],
        pagination: {
          limit,
          page,
          total: 0,
        },
      },
      {
        status: 200,
      }
    )
  }
}
