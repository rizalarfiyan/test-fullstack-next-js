import { BaseResponse, BaseResponseList } from '@/types/api'
import axios, { requestHandler } from '@/lib/axios'

import {
  CreateStudentRequest,
  DeleteStudentRequest,
  RestoreStudentRequest,
  StudentResponse,
  UpdateStudentRequest,
} from '@/types/api/student'

const getAll = requestHandler<any, BaseResponseList<StudentResponse>>((params: any) => {
  return axios.get('/student', { params })
})

const getDetail = requestHandler<string, BaseResponseList<StudentResponse>>((uuid: any) => {
  return axios.get('/student/' + uuid)
})

const deleteBatch = requestHandler<DeleteStudentRequest, BaseResponse>((params) => {
  return axios.delete('/student', {
    data: params,
  })
})

const restoreBatch = requestHandler<RestoreStudentRequest, BaseResponse>((params) => {
  return axios.post('/student/restore', { ...params })
})

const create = requestHandler<CreateStudentRequest, BaseResponse>((params) => {
  return axios.post('/student', { ...params })
})

const edit = requestHandler<UpdateStudentRequest, BaseResponse>((params) => {
  return axios.put('/student/' + params?.uuid, { ...params })
})

export { getAll, getDetail, create, edit, deleteBatch, restoreBatch }
