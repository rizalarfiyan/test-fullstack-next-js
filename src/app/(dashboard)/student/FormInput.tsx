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
import { Eye, Pencil, Plus, PlusCircle, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTableHandle } from '@/components/Datatable'
import useDisclosure from '@/hooks/useDisclosure'
import { useMutation } from '@tanstack/react-query'
import { ErrorResponse } from '@/types/api'
import { create, edit, getDetail } from '@/service/student'
import { EMPTY_FUNC } from '@/constants'
import Dropdown from './Dropdown'
import { getAll } from '@/service/university'
import { Textarea } from '@/components/Textarea'
import { useMemo } from 'react'
import { StudentResponse } from '@/types/api/student'
import { toast } from 'sonner'

type FormInputProps = {
  tableRef?: React.RefObject<DataTableHandle>
  isDetail?: boolean
  uuid?: string
  data?: StudentResponse
  children?: React.ReactNode
}

const FormSchema = z.object({
  student_id: z.string().min(6).max(16),
  name: z.string().min(3).max(64),
  phone: z.string().min(10).max(16),
  address: z.string().min(1).max(255),
  university_id: z.string().uuid(),
})

const FormInput: React.FC<FormInputProps> = ({ children, tableRef, isDetail, uuid, data }) => {
  const state = useDisclosure()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      student_id: data?.nim || '',
      name: data?.name || '',
      phone: data?.phone || '',
      address: data?.address || '',
      university_id: data?.university_id || '',
    },
  })

  const isCreate = !isDetail && !uuid
  const isEdit = !isDetail && !!uuid
  const isView = isDetail && !!uuid
  const { isDirty, isValid } = form.formState

  const apiCreate = useMutation({
    mutationFn: create,
    onSuccess: () => {
      state.close()
      tableRef?.current?.update()
      tableRef?.current?.resetSelection()
      toast.success('Student has been created.')
    },
    onError: (error: ErrorResponse<null>) => {
      state.close()
      toast.error(error.message)
    },
  })

  const apiEdit = useMutation({
    mutationFn: edit,
    onSuccess: () => {
      state.close()
      form.reset()
      tableRef?.current?.update()
      tableRef?.current?.resetSelection()
      toast.success('Student has been updated.')
    },
    onError: (error: ErrorResponse<null>) => {
      state.close()
      toast.error(error.message)
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isEdit) {
      await apiEdit.mutateAsync({ ...data, uuid: uuid as string })
      return
    }
    await apiCreate.mutateAsync(data)
  }

  const isDisabled = isView || apiCreate.isPending || apiEdit.isPending
  const element = useMemo(() => {
    if (isCreate) {
      return (
        <>
          <PlusCircle />
          Create
        </>
      )
    }
    if (isEdit) {
      return (
        <>
          <Pencil />
          Edit
        </>
      )
    }
    return (
      <>
        <Eye />
        Detail
      </>
    )
  }, [isCreate, isEdit])

  return (
    <Dialog open={state.isOpen} onOpenChange={apiCreate.isPending ? EMPTY_FUNC : state.toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <div className='flex items-center gap-2 border-slate-200 pb-3 mb-2 border-b'>{element}</div>
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='student_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIM</FormLabel>
                      <FormControl>
                        <Input placeholder='22.11.5227' {...field} disabled={isDisabled} />
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
                        <Input placeholder='Rizal' {...field} disabled={isDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder='08xxxxxxx' {...field} disabled={isDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Jln Pegangsaan Timur No.57'
                          {...field}
                          className='max-h-40'
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='university_id'
                  render={() => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Dropdown
                          apiController={getAll}
                          initialValue={
                            data?.university_id && data?.university_name
                              ? {
                                  id: data?.university_id,
                                  name: data?.university_name,
                                }
                              : undefined
                          }
                          disabled={isDisabled}
                          onChange={(val) => {
                            form.setValue('university_id', val || '')
                          }}
                        />
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
                    disabled={isDisabled}
                  >
                    Close
                  </Button>
                </DialogClose>
                {(isCreate || isEdit) && (
                  <Button
                    type='submit'
                    leftIcon={<Plus className='mr-2 w-5 h-5' />}
                    isLoading={apiCreate.isPending || apiEdit.isPending}
                    disabled={!isDirty || !isValid || isDisabled}
                  >
                    {isCreate ? 'Create' : 'Update'}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FormInput
