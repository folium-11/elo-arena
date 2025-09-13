"use client"
import { useEffect, useState } from 'react'

export default function SignInGate() {
  const [enabled, setEnabled] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(undefined)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')

  async function refresh() {
    const res = await fetch('/api/auth/me', { cache: 'no-store' })
    if (res.ok) {
      const { name, enabled } = await res.json()
      setName(name)
      setEnabled(enabled)
    }
  }
  useEffect(() => { refresh() }, [])

  async function signIn() {
    setStatus('')
    const res = await fetch('/api/auth/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: input }), cache: 'no-store' })
    if (!res.ok) setStatus((await res.json()).error || 'Failed')
    await refresh()
  }
  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST', cache: 'no-store' })
    await refresh()
  }

  if (!enabled) return null
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Sign In</h3>
        {name && <div className="text-xs text-neutral-500">Signed in as {name}</div>}
      </div>
      {!name ? (
        <div className="flex gap-2">
          <input className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" placeholder="Allowed name" value={input} onChange={e => setInput(e.target.value)} />
          <button className="btn btn-primary" onClick={signIn}>Enter</button>
        </div>
      ) : (
        <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
      )}
      {status && <div className="text-xs text-red-500 mt-1">{status}</div>}
    </section>
  )
}

