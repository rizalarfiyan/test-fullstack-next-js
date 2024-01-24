export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <header className='h-16 bg-white shadow-white border border-b-slate-200 fixed top-0 w-full'></header>
      <div>
        <aside className='h-screen bg-white broder border-r-slate-200 w-64 fixed left-0 top-16'></aside>
        <main className='pt-16 w-full pl-64 flex'>{children}</main>
      </div>
    </>
  )
}
