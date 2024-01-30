export type StudentResponse = {
  id: string
  sequence: number
  nim: string
  name: string
  address: string
  phone: string
  university_id: string
  university_name: string
}

export type CreateStudentRequest = {
  name: string
  phone: string
  student_id: string
  address: string
  university_id: string
}

export type UpdateStudentRequest = CreateStudentRequest & {
  uuid: string
}

export type RestoreStudentRequest = {
  ids: string[]
}

export type DeleteStudentRequest = RestoreStudentRequest & {
  is_force_delete?: boolean
}
