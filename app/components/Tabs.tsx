"use client"
import { useState } from 'react'

export default function Tabs<T extends string>({ tabs, initial, onChange }: { tabs: { key: T, label: string }[]; initial: T; onChange: (k: T) => void }) {
  const [active, setActive] = useState<T>(initial)
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {tabs.map(t => (
        <button key={t.key} className={`px-3 py-1.5 text-sm ${active === t.key ? 'bg-accent text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`} onClick={() => { setActive(t.key); onChange(t.key) }}>{t.label}</button>
      ))}
    </div>
  )
}

