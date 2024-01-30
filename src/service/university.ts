import { BaseResponseList } from '@/types/api'
import axios, { requestHandler } from '@/lib/axios'
import { UniversityResponse } from '@/types/api/university'

const getAll = requestHandler<any, BaseResponseList<UniversityResponse>>((params: any) => {
  return axios.get('/university', { params })
})

export { getAll }
