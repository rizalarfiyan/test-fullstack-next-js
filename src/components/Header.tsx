import LinkMenu from '@/components/LinkMenu'

const Header = () => {
  return (
    <header className='h-16 bg-white shadow-white border border-b-slate-200 fixed top-0 w-full z-[99]'>
      <div className='container flex items-center justify-between h-full'>
        <a href='http://github.com/rizalarfiyan'>
          <h1 className='font-semibold text-xl text-slate-800'>@rizalarfiyan</h1>
        </a>
        <LinkMenu />
      </div>
    </header>
  )
}

export default Header
