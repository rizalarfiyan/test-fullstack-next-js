'use client'

import 'swagger-ui-react/swagger-ui.css'
import dynamic from 'next/dynamic'
import Spinner from '@/components/Spinner'

const DynamicSwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center w-full h-full min-h-screen flex-col gap-2'>
      <Spinner className='w-10 h-10' />
      <p className='text-slate-800'>Loading swagger...</p>
    </div>
  ),
})

export default function DocsPage() {
  return (
    <section className='container'>
      <DynamicSwaggerUI url='/swagger.json' />
    </section>
  )
}
