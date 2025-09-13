import { useEffect } from 'react'

export function useKey(targetKeys: string[], handler: (key: string, e: KeyboardEvent) => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (targetKeys.includes(e.key)) handler(e.key, e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, targetKeys])
}

