'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import queryClient from '@/lib/react-query'

const ReactQueryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
