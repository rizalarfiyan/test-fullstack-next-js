'use client'

import { Button } from '@/components/ui/button'
import { LIMIT_PERPAGE_DEFAULT, LIST_LIMIT_PERPAGE } from '@/constants'
import useFetch from '@/hooks/useFetch'
import { ChevronDown, Eye, FileBarChart, Filter, PlusCircle, Recycle, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Student() {
  const [limit, setLimit] = useState(LIMIT_PERPAGE_DEFAULT)

  const onChangeLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setLimit(parseInt(e.target.value))
  }

  const data = useFetch('/student')

  // useEffect(() => {
  //   console.log(limit)
  // }, [limit])

  return (
    <div className='m-10 p-5 rounded-md bg-white flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button state='primary' variant='solid'>
            Active
          </Button>
          <Button variant='outline' leftIcon={<Recycle className='mr-2' />}>
            Recycle Bin (1)
          </Button>
          <Button variant='outline' leftIcon={<PlusCircle className='mr-2' />}>
            Create
          </Button>
          <Button variant='outline' leftIcon={<Trash className='mr-2' />}>
            Bulk Delete
          </Button>
          <Button
            variant='outline'
            leftIcon={<FileBarChart className='mr-2' />}
            rightIcon={<ChevronDown className='ml-2' />}
          >
            Export
          </Button>
          <Button variant='outline' leftIcon={<Eye className='mr-2' />} rightIcon={<ChevronDown className='ml-2' />}>
            Show
          </Button>
          <Button variant='outline' leftIcon={<Filter className='mr-2' />}>
            Filter
          </Button>
        </div>
        <div className='flex items-center gap-4'>
          <span>Display</span>
          <select
            name='limit'
            onChange={onChangeLimit}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            {LIST_LIMIT_PERPAGE.map((limit, key) => {
              return (
                <option value={limit} key={key}>
                  {limit}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, quia! Illum, doloribus sit iure sequi
        exercitationem voluptates ipsam temporibus unde. Nobis sequi obcaecati sed, hic voluptates quidem excepturi quis
        distinctio officiis quae eveniet necessitatibus doloremque ad. Cupiditate, ratione id! Nulla exercitationem
        minima nisi excepturi numquam autem quaerat debitis itaque corrupti cupiditate sunt, consequatur, molestias
        repellendus provident minus ut amet veritatis beatae laborum delectus explicabo molestiae deserunt natus! Quas
        ea non esse vel perferendis dicta culpa deleniti animi minima repellat natus necessitatibus nulla, magni error
        quisquam eveniet quaerat consequatur labore, laboriosam nemo deserunt quod itaque? Quasi ab asperiores ad nam
        numquam!
      </p>
    </div>
  )
}
