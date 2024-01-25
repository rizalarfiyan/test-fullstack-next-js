import React from 'react'
import { BookUser, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/Button'
import Link from 'next/link'

type LinkMenuProps = {
  className?: string
}

type LinkProps = {
  title: string
  href: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
}

const LINK_MENU: LinkProps[] = [
  {
    title: 'Students',
    href: '/student',
    leftIcon: <BookUser className='mr-2' />,
  },
  {
    title: 'Api Docs',
    href: '/api/docs',
    leftIcon: <FileCode2 className='mr-2' />,
  },
]

const LinkMenu: React.FC<LinkMenuProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {LINK_MENU.map(({ title, href, leftIcon, rightIcon }, idx) => (
        <Button variant='outline' asChild leftIcon={leftIcon} rightIcon={rightIcon} key={idx}>
          <Link href={href}>{title}</Link>
        </Button>
      ))}
    </div>
  )
}

export default LinkMenu
