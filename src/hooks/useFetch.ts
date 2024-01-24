import { useEffect, useRef, useState } from 'react'

export type UseFetch<TData> = {
  cancel: () => void
  refresh: () => void
  data: TData | null
  error: string
  loaded: boolean
}

const useFetch = <TData>(url: string): UseFetch<TData> => {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const controllerRef = useRef(new AbortController())
  const cancel = () => {
    controllerRef.current.abort()
  }

  const refresh = async () => {
    setData(null)
    setError('')
    setLoaded(false)
    await fetchData()
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api' + url, {
        signal: controllerRef.current.signal,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        setData(responseData)
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      setError((error as string) ?? 'Something went wrong from your request')
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()

    return () => {
      cancel()
    }
    // eslint-disable-next-line
}, [url])

  return { cancel, data, error, loaded, refresh }
}

export default useFetch
