"use client"
import { useEffect, useState } from 'react'

export default function Toast() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      setMsg(e.detail)
      const t = setTimeout(() => setMsg(null), 2000)
      return () => clearTimeout(t)
    }
    // @ts-ignore
    window.addEventListener('elo:toast', handler as any)
    return () => {
      // @ts-ignore
      window.removeEventListener('elo:toast', handler as any)
    }
  }, [])
  if (!msg) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-neutral-900 text-white shadow-soft">
      {msg}
    </div>
  )
}

export function triggerToast(message: string) {
  const evt = new CustomEvent('elo:toast', { detail: message })
  // @ts-ignore
  window.dispatchEvent(evt)
}

