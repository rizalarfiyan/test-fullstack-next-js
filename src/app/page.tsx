import LinkMenu from '@/components/LinkMenu'

export default function Home() {
  return (
    <main className='w-full h-full min-h-screen flex-col flex justify-center gap-6 items-center'>
      <div className='text-center'>
        <h1 className='font-semibold text-slate-800 text-2xl lg:text-4xl'>Test Fullstack Next.js</h1>
        <p className='text-slate-600'>
          by{' '}
          <a className='underline decoration-blue-400 underline-offset-2' href='https://github.com/rizalarfiyan'>
            @rizalarfiyan
          </a>
        </p>
      </div>
      <LinkMenu />
    </main>
  )
}
