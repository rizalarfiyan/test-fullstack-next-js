import Button from '@/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form'
import { Input } from '@/components/Input'
import { CornerUpRight, Filter, RotateCcw, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { stringUndefined } from '@/lib/utils'

type FormFilterProps = {
  onFilterChange: (filter: Record<string, any>) => void
}

const FormSchema = z.object({
  nim: z.string(),
  name: z.string(),
  university_name: z.string(),
})

const FormFilter: React.FC<FormFilterProps> = ({ onFilterChange }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nim: '',
      name: '',
      university_name: '',
    },
  })

  const onReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    form.reset()
    onFilterChange({})
  }

  const onSubmit = ({ name, nim, university_name }: z.infer<typeof FormSchema>) => {
    onFilterChange({
      name: stringUndefined(name),
      student_id: stringUndefined(nim),
      university_name: stringUndefined(university_name),
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          leftIcon={<Filter className='mr-2' />}
          className='rounded-md md:rounded-r-md md:rounded-l-none relative'
        >
          {form.formState.isDirty && <div className='w-3 h-3 rounded-full bg-sky-500 -top-1 -right-1 absolute' />}
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <div className='flex items-center gap-2 border-slate-200 pb-3 mb-2 border-b'>
              <Filter />
              Filter
            </div>
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='nim'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIM</FormLabel>
                      <FormControl>
                        <Input placeholder='22.11.5227' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Rizal' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='university_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Amikom' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type='button'
                    variant='subtle'
                    state='secondary'
                    leftIcon={<XCircle className='mr-2 w-5 h-5' />}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type='reset'
                  state='warning'
                  leftIcon={<RotateCcw className='mr-2 w-5 h-5' />}
                  onClick={onReset}
                >
                  Reset
                </Button>
                <Button type='submit' leftIcon={<CornerUpRight className='mr-2 w-5 h-5' />}>
                  Filter
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FormFilter
