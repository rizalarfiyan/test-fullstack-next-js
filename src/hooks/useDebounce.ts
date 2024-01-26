import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, timeout: number): Readonly<T> {
  const [state, setState] = useState(value)

  useEffect(() => {
    const tick = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(tick)
  }, [value, timeout])

  if (timeout <= 0) return value
  return state
}

export default useDebounce
