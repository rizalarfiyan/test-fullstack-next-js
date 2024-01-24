interface BaseApi<T> {
  code: number
  message: string
  data: T
}

type BaseApiWithPagination<T> = BaseApi<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}
