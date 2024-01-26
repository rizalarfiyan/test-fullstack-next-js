import { useCallback, useState } from 'react'

export type UseDisclosure = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const useDisclosure = (initial = false): UseDisclosure => {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((state) => !state), [])

  return { isOpen, open, close, toggle }
}

export default useDisclosure
