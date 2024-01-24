import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='w-full h-full min-h-screen flex-col flex justify-center gap-4 items-center'>
      <h1 className='font-semibold text-3xl'>Fullstack Next.js Test</h1>
      <Link href='/student' className={buttonVariants()}>
        Student
      </Link>
    </main>
  )
}
