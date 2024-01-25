import Header from '@/components/Header'
import React from 'react'

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div>
        <aside className='h-screen bg-white broder border-r-slate-200 w-64 fixed left-0 top-16'></aside>
        <main className='pt-16 w-full pl-64 flex'>{children}</main>
      </div>
    </>
  )
}
