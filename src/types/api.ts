interface BaseApi<T> {
  message: string
  data: T
}

type BaseApiWithPagination<T> = BaseApi<T[]> & {
  pagination: {
    page: number
    limit: number
    total: {
      data: number
      page: number
      deleted: number
    }
  }
}
