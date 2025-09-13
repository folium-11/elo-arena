"use client"
import { useEffect, useRef, useState } from 'react'

export default function InlineEdit({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(value)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus(); ref.current?.select() }, [])
  return (
    <input
      ref={ref}
      className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent"
      value={v}
      onChange={e => setV(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') onSave(v)
        if (e.key === 'Escape') onCancel()
      }}
      onBlur={() => onSave(v)}
    />
  )
}

