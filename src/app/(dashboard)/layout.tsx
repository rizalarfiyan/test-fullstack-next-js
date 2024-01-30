import Header from '@/components/Header'
import React from 'react'

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div>
        <main className='px-2 lg:px-6 xl:px-10 pb-4 lg:pb-10 xl:pb-16 pt-20 lg:pt-24 xl:pt-28 w-full'>{children}</main>
      </div>
    </>
  )
}
