import Header from '@/components/Header'
import React from 'react'

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div>
        <main className='px-10 pb-16 pt-28 w-full'>{children}</main>
      </div>
    </>
  )
}
