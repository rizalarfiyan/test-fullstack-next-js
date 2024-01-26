import { BaseResponseList } from '@/types/api'
import axios, { requestHandler } from '@/lib/axios'

import { StudentResponse } from '@/types/api/student'

const getAll = requestHandler<any, BaseResponseList<StudentResponse>>((params: any) => {
  return axios.get('/student', { params })
})

export { getAll }
