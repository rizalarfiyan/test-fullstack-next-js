import { DefaultOptions, QueryClient } from '@tanstack/react-query'

export const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
}

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

export default queryClient
