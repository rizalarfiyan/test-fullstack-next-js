import { BaseResponse, BaseResponseList } from '@/types/api'
import axios, { requestHandler } from '@/lib/axios'

import { DeleteStudentRequest, RestoreStudentRequest, StudentResponse } from '@/types/api/student'

const getAll = requestHandler<any, BaseResponseList<StudentResponse>>((params: any) => {
  return axios.get('/student', { params })
})

const deleteBatch = requestHandler<DeleteStudentRequest, BaseResponse>((params) => {
  return axios.delete('/student', {
    data: params,
  })
})

const restoreBatch = requestHandler<RestoreStudentRequest, BaseResponse>((params) => {
  return axios.post('/student/restore', { ...params })
})

export { getAll, deleteBatch, restoreBatch }
