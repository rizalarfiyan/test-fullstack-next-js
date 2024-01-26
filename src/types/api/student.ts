export type StudentResponse = {
  id: string
  sequence: number
  nim: string
  name: string
  university_name: string
}

export type RestoreStudentRequest = {
  ids: string[]
}

export type DeleteStudentRequest = RestoreStudentRequest & {
  is_force_delete?: boolean
}
