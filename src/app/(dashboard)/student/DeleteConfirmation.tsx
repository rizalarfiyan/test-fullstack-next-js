import Button from '@/components/Button'
import { DataTableHandle } from '@/components/Datatable'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { ScrollArea } from '@/components/ScrollArea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { EMPTY_FUNC } from '@/constants'
import useDisclosure from '@/hooks/useDisclosure'
import { deleteBatch } from '@/service/student'
import { ErrorResponse } from '@/types/api'
import { StudentResponse } from '@/types/api/student'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Trash2, XCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type DeleteConfirmationProps = {
  children?: React.ReactNode
  data?: StudentResponse[]
  isSoftDelete?: boolean
  tableRef?: React.RefObject<DataTableHandle>
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ children, data, isSoftDelete, tableRef }) => {
  const state = useDisclosure()
  const api = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      state.close()
      tableRef?.current?.update()
      tableRef?.current?.resetSelection()
      toast.success(
        `${data?.length || ''} Student has been ${isSoftDelete ? 'move to recycle bin' : 'permanently deleted'}.`
      )
    },
    onError: (error: ErrorResponse<null>) => {
      state.close()
      toast.error(error.message)
    },
  })

  const onClickButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (data?.length) {
      await api.mutateAsync({
        ids: data.map((item) => item.id),
        is_force_delete: !isSoftDelete,
      })
    }
  }

  const isEmpty = data?.length === 0
  return (
    <Dialog open={state.isOpen} onOpenChange={api.isPending ? EMPTY_FUNC : state.toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <div className='flex items-center gap-2 border-slate-200 pb-3 mb-2 border-b'>
              <AlertCircle className='mr-2' />
              Delete {!isSoftDelete && 'permanent '}confirmation
            </div>
          </DialogTitle>
          {!isEmpty && (
            <ScrollArea className='max-h-[50vh]'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-10'>#</TableHead>
                    <TableHead>Item</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell className='line-clamp-1'>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
          {isEmpty ? (
            <DialogDescription className='py-4 text-slate-700'>Please select your data row.</DialogDescription>
          ) : (
            <DialogDescription className='py-4 text-slate-700'>
              Are you sure you want to delete {!isSoftDelete && 'permanent? '}
              {data?.length} record(s) above?
            </DialogDescription>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type='button'
                variant='subtle'
                state='secondary'
                leftIcon={<XCircle className='mr-2 w-5 h-5' />}
                disabled={api.isPending}
              >
                Close
              </Button>
            </DialogClose>
            {!isEmpty && (
              <Button
                state='danger'
                leftIcon={<Trash2 className='mr-2 w-5 h-5' />}
                onClick={onClickButton}
                isLoading={api.isPending}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmation
